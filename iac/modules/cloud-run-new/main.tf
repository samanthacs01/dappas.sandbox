provider "google" {
  project = var.project_id
  region  = var.region
}


# **Cloud Run Service**
resource "google_cloud_run_service" "default" {
  name     = var.name
  location = var.region

    metadata {
    annotations = {
      "run.googleapis.com/ingress" = var.ingress 
      "run.googleapis.com/vpc-access-connector" = var.connector                 
      "run.googleapis.com/vpc-access-egress"    = "all-traffic" 
    }
  }

  template {
    spec {
      service_account_name = var.service_account

      containers {
        image = var.image

        dynamic "env" {
        for_each = var.env_vars
        content {
            name  = env.key
            value = env.value
        }
        }
       resources {
        limits = {
        cpu    = var.cpu_limit
        memory = var.memory_limit
        }
       }

      } 
    }
  }
}

# IAM role that allows "allUsers" making HTTP requests to a Cloud Run service
resource "google_cloud_run_service_iam_member" "no_auth" {
  count   = var.allow_unauthenticated ? 1 : 0

  location = var.region
  project  = var.project_id
  service  = google_cloud_run_service.default.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}


# **Global Static IP for Load Balancer**
resource "google_compute_global_address" "default" {
  name    = "glb-ip-${var.name}"
  project = var.project_id
}

# **Global Load Balancer (HTTPS)**
module "load_balancer" {
  source     = "git::https://github.com/GoogleCloudPlatform/cloud-foundation-fabric.git//modules/net-lb-app-ext?ref=v36.0.0"
  project_id = var.project_id
  name       = "glb-${var.name}"
  address    = google_compute_global_address.default.address

  backend_service_configs = {
    default = {
      backends = [
        { backend = "neg-0" }
      ]
      port_name = "http"
      health_checks = []
    }
  }

  neg_configs = {
    neg-0 = {
      cloudrun = {
        region        = var.region
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

# **Cloud Armor Security Policy**
resource "google_compute_security_policy" "cloud_run_policy" {
  name    = "cloud-run-policy-${var.name}"
  project = var.project_id
  rule {
    action   = "deny(403)"
    priority = 1000
    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = var.security_policy.ip_blacklist
      }
    }
    description = "Deny access from blacklisted IPs"
  }
  
  rule {
    action   = "allow"
    priority = 2147483647
    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = ["*"]
      }
    }
    description = "Allow all traffic"
  }
}

