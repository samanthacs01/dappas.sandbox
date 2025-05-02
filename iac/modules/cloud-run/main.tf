provider "google" {
  project = var.project_id
  region  = var.region
}


resource "google_cloud_run_v2_service" "default" {
  name     = var.name
  location = var.region
  project  = var.project_id
  ingress  = var.ingress

  template {

    dynamic "volumes" {
      for_each = var.volumes_config.cloudsql_enabled ? [1] : []
      content {
        name = "cloudsql"
        cloud_sql_instance {
          instances = [var.INSTANCE_CONNECTION_NAME]
        }
      }
    }

    dynamic "volumes" {
      for_each = var.volumes_config.gcs_enabled ? [1] : []
      content {
        name = "gcs-bucket-volume"
        gcs {
          bucket    = var.bucket_name
          read_only = false
        }
      }
    }

    containers {
      image = var.image

      # Variables de entorno
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

      # Mounts dinámicos
      dynamic "volume_mounts" {
        for_each = var.volumes_config.cloudsql_enabled ? [1] : []
        content {
          name       = "cloudsql"
          mount_path = "/cloudsql"
        }
      }

      dynamic "volume_mounts" {
        for_each = var.volumes_config.gcs_enabled ? [1] : []
        content {
          name       = "gcs-bucket-volume"
          mount_path = "/mnt/gcs"
        }
      }
    }

    vpc_access {
      connector = var.connector
      egress    = "ALL_TRAFFIC"
    }
  }
}



# resource "google_cloud_run_v2_service" "default" {
#   name     = var.name
#   location = var.region
#   project  = var.project_id
#   ingress  = var.ingress

#   template {

#     volumes {
#       name = "cloudsql"
#       cloud_sql_instance {
#         instances = [var.INSTANCE_CONNECTION_NAME]
#       }
#     }    
#     volumes {
#       name = "gcs-bucket-volume"
#       gcs {
#         bucket        = var.bucket_name
#         read_only     = false
#       }
#     }    
    
#     containers {
#       image = var.image
      
      
#       dynamic "env" {
#         for_each = var.env_vars
#         content {
#           name  = env.key
#           value = env.value
#         }
#       }

#       resources {
#         limits = {
#           cpu    = var.cpu_limit
#           memory = var.memory_limit
#         }
#       }

#       volume_mounts {
#         name = "cloudsql"
#         mount_path = "/cloudsql"
#       }

#       volume_mounts {
#         name       = "gcs-bucket-volume"
#         mount_path = "/mnt/gcs"
#       }
#     }

#     vpc_access {
#       connector = var.connector
#       egress    = "ALL_TRAFFIC"
#     }
#   }
# }

   






# IAM role that allows "allUsers" making HTTP requests to a Cloud Run service
resource "google_cloud_run_service_iam_member" "no_auth" {
  count   = var.allow_unauthenticated ? 1 : 0

  location = var.region
  project  = var.project_id
  service  = google_cloud_run_v2_service.default.name
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
      security_policy = google_compute_security_policy.cloud_run_policy.id
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


