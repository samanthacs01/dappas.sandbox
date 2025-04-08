locals {
  gclb_create  = var.custom_domain == null ? false : true
  iap_sa_email = try(google_project_service_identity.iap_sa[0].email, "")
  # Condition to check if the name starts with "pulse-web"
  create_cloudsql_volume = !startswith(var.name, "pulse-web")
  create_bucket_volume   = startswith(var.name, "pulse-api")
  is_dev                 = split("-", var.name)[2] == "dev"
}

module "project" {
  source = "../project"
  billing_account = (var.project_create != null
    ? var.project_create.billing_account_id
    : null
  )
  parent = (var.project_create != null
    ? var.project_create.parent
    : null
  )
  name = var.project_id
  services = [
    "run.googleapis.com",
    "compute.googleapis.com",
    "iap.googleapis.com"
  ]
  project_create = var.project_create != null
}

# Cloud Run service
module "cloud_run" {
  source          = "../cloud-run-v2"
  project_id      = module.project.project_id
  name            = var.name
  region          = var.region
  service_account = var.service_account

  containers = {

    default = {

      image = var.image

      volume_mounts = local.create_bucket_volume ? {
        "cloudsql" = "/cloudsql"
        "bucket"   = "/app/bucket"
      } : null

      resources = {
        limits = {
          cpu    = "2000m"
          memory = "2Gi"
        }
        cpu_idle = true
      }

      env = local.create_cloudsql_volume ? {
        INSTANCE_CONNECTION_NAME       = var.INSTANCE_CONNECTION_NAME
        PROCESSOR_ENV                  = var.PROCESSOR_ENV
        SUPPORT_EMAIL                  = var.SUPPORT_EMAIL
        FRONTEND_BASE_URL              = var.FRONTEND_BASE_URL
        GOOGLE_APPLICATION_CREDENTIALS = var.GOOGLE_APPLICATION_CREDENTIALS
        CLOUD_STORAGE_BUCKET_NAME      = var.CLOUD_STORAGE_BUCKET_NAME
        CLOUD_PROJECT_ID               = var.CLOUD_PROJECT_ID
        CLOUD_PROJECT_NUMBER           = var.CLOUD_PROJECT_NUMBER
        DOCUMENT_AI_PROCESSOR_ID       = var.DOCUMENT_AI_PROCESSOR_ID
        DOCUMENT_AI_PROCESSOR_LOCATION = var.DOCUMENT_AI_PROCESSOR_LOCATION
        CLOUD_TASK_ID                  = var.CLOUD_TASK_ID
        FROM_EMAIL                     = var.FROM_EMAIL
        SESSION_EXPIRE                 = var.SESSION_EXPIRE
        APP_ENV                        = var.APP_ENV
        BASE_URL                       = var.BASE_URL
        DB_HOST                        = var.DB_HOST
        } : {
        NEXT_APP_API_URL                = var.NEXT_APP_API_URL
        NEXT_PUBLIC_SESSION_COOKIE_NAME = var.NEXT_PUBLIC_SESSION_COOKIE_NAME
        NEXT_PUBLIC_SOCKET_URL          = var.NEXT_PUBLIC_SOCKET_URL
        NEXTAUTH_URL                    = var.NEXTAUTH_URL
        NEXTAUTH_SECRET                 = var.NEXTAUTH_SECRET
        NEXTAUTH_SESSION_EXPIRE         = var.NEXTAUTH_SESSION_EXPIRE
        NEXT_PUBLIC_APP_ENV             = local.is_dev ? var.NEXT_PUBLIC_APP_ENV : null
      }

      env_from_key = local.create_cloudsql_volume ? {
        DB_USER = {
          secret  = var.DB_USER
          version = "latest"
        }
        DB_PASS = {
          secret  = var.DB_PASS
          version = "latest"
        }
        DB_NAME = {
          secret  = var.DB_NAME
          version = "latest"
        }
        PULSE_ADMIN_PASSWORD = {
          secret  = var.PULSE_ADMIN_PASSWORD
          version = "latest"
        }
        RESEND_API_KEY = {
          secret  = var.RESEND_API_KEY
          version = "latest"
        }

      } : null
    }
  }

  revision = local.create_cloudsql_volume ? {
    gen2_execution_environment = true
    vpc_access = {
      connector = var.connector
      egress    = "ALL_TRAFFIC"
    }
  } : null

  # Define volumes conditionally
  volumes = merge(
    local.create_cloudsql_volume ? {
      "cloudsql" = {
        cloud_sql_instances = [var.INSTANCE_CONNECTION_NAME]
      }
    } : {},

    local.create_bucket_volume ? {
      "bucket" = {
        gcs = {
          #bucket    = "${var.bucket_name}-${split(".", var.custom_domain)[1]}"
          bucket    = "${var.bucket_name}-${split("-", var.name)[2]}"
          read_only = false
          mount_options = [
            "metadata-cache-ttl-secs=120s",
            "type-cache-max-size-mb=4"
          ]
        }
      }
    } : {}
  )

  #max_instance_request_concurrency = 1000

  iam = {
    "roles/run.invoker" = (local.gclb_create && var.iap.enabled
      ? ["serviceAccount:${local.iap_sa_email}"]
      : ["allUsers"]
    )
  }
  ingress = var.ingress
}

# Reserved static IP for the Load Balancer
resource "google_compute_global_address" "default" {
  count   = local.gclb_create ? 1 : 0
  project = module.project.project_id
  name    = "glb-ip-${var.name}"
}

# Global L7 HTTPS Load Balancer in front of Cloud Run
module "glb" {
  source     = "../net-lb-app-ext"
  count      = local.gclb_create ? 1 : 0
  project_id = module.project.project_id
  name       = "glb-${var.name}"
  address    = google_compute_global_address.default[0].address
  backend_service_configs = {
    default = {
      backends = [
        { backend = "neg-0" }
      ]
      health_checks = []
      port_name     = "http"
      security_policy = try(google_compute_security_policy.policy[0].name,
      null)
      iap_config = try({
        oauth2_client_id     = google_iap_client.iap_client[0].client_id,
        oauth2_client_secret = google_iap_client.iap_client[0].secret
      }, null)
    }
  }
  health_check_configs = {}
  neg_configs = {
    neg-0 = {
      cloudrun = {
        region = var.region
        target_service = {
          name = var.name
        }
      }
    }
  }
  protocol = "HTTPS"
  ssl_certificates = {
    managed_configs = {
      default = {
        domains = [var.custom_domain]
      }
    }
  }
}

# Cloud Armor configuration
resource "google_compute_security_policy" "policy" {
  count   = local.gclb_create && var.security_policy.enabled ? 1 : 0
  name    = "cloud-run-policy"
  project = module.project.project_id
  rule {
    action   = "deny(403)"
    priority = 1000
    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = var.security_policy.ip_blacklist
      }
    }
    description = "Deny access to list of IPs"
  }
  rule {
    action   = "deny(403)"
    priority = 900
    match {
      expr {
        expression = "request.path.matches(\"${var.security_policy.path_blocked}\")"
      }
    }
    description = "Deny access to specific URL paths"
  }
  rule {
    action   = "allow"
    priority = "2147483647"
    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = ["*"]
      }
    }
    description = "Default rule"
  }
}

# Identity-Aware Proxy (IAP) or OAuth brand (see OAuth consent screen)
# Note:
# Only "Organization Internal" brands can be created programmatically
# via API. To convert it into an external brand please use the GCP
# Console.
# Brands can only be created once for a Google Cloud project and the
# underlying Google API doesn't support DELETE or PATCH methods.
# Destroying a Terraform-managed Brand will remove it from state but
# will not delete it from Google Cloud.
resource "google_iap_brand" "iap_brand" {
  count   = local.gclb_create && var.iap.enabled ? 1 : 0
  project = module.project.project_id
  # Support email displayed on the OAuth consent screen. The caller must be
  # the user with the associated email address, or if a group email is
  # specified, the caller can be either a user or a service account which
  # is an owner of the specified group in Cloud Identity.
  support_email     = var.iap.email
  application_title = var.iap.app_title
}

# IAP owned OAuth2 client
# Note:
# Only internal org clients can be created via declarative tools.
# External clients must be manually created via the GCP console.
# Warning:
# All arguments including secret will be stored in the raw state as plain-text.
resource "google_iap_client" "iap_client" {
  count        = local.gclb_create && var.iap.enabled ? 1 : 0
  display_name = var.iap.oauth2_client_name
  brand        = google_iap_brand.iap_brand[0].name
}

# IAM policy for IAP
# For simplicity we use the same email as support_email and authorized member
resource "google_iap_web_iam_member" "iap_iam" {
  count   = local.gclb_create && var.iap.enabled ? 1 : 0
  project = module.project.project_id
  role    = "roles/iap.httpsResourceAccessor"
  member  = "user:${var.iap.email}"
}

# SA service agent for IAP, which invokes CR
# Note:
# Once created, this resource cannot be updated or destroyed. These actions are a no-op.
resource "google_project_service_identity" "iap_sa" {
  provider = google-beta
  count    = local.gclb_create && var.iap.enabled ? 1 : 0
  project  = module.project.project_id
  service  = "iap.googleapis.com"
}
