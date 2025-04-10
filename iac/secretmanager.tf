# Generate a random password for PostgreSQL root user
resource "random_password" "postgres_root_password_dappas" {
  length      = 16
  special     = true
  min_upper   = 2
  min_lower   = 2
  min_numeric = 2
  min_special = 2
}



module "secret_manager" {
  source = "./modules/secret-manager"
  secrets = {
    "dbusersecret-${terraform.workspace}" = {
      id        = "dbusersecret-${terraform.workspace}"
      locations = ["us-east1"]
      # keys      = []
      # expire_time = "2023-01-24T00:00:00Z"
      # version_destroy_ttl = "86400s"
      secret_data = "postgres"
      role       = "roles/secretmanager.secretAccessor"
      members  = [
        "${google_project_iam_member.member-role["roles/secretmanager.secretVersionManager"].member}",
        "serviceAccount:${data.google_project.project.number}-compute@developer.gserviceaccount.com"
      ]
    },
    "dbnamesecret-${terraform.workspace}" = {
      id        = "dbnamesecret-${terraform.workspace}"
      locations = ["us-east1"]
      # keys      = []
      # expire_time = "2023-01-25T00:00:00Z"
      # version_destroy_ttl = "86400s"
      secret_data = google_sql_database.db_dappas.name
      role       = "roles/secretmanager.secretAccessor"
      members  = [
        "${google_project_iam_member.member-role["roles/secretmanager.secretVersionManager"].member}",
        "serviceAccount:${data.google_project.project.number}-compute@developer.gserviceaccount.com"
      ]      
    },
    "resend-api-key-${terraform.workspace}" = {
      id        = "resend-api-key-${terraform.workspace}"
      locations = ["us-east1"]
      # keys      = []
      # expire_time = "2023-01-25T00:00:00Z"
      # version_destroy_ttl = "86400s"
      secret_data = var.resend-api-key
      role       = "roles/secretmanager.secretAccessor"
      members  = [
        "${google_project_iam_member.member-role["roles/secretmanager.secretVersionManager"].member}",
        "serviceAccount:${data.google_project.project.number}-compute@developer.gserviceaccount.com"
      ]      
    },
    "admin-passwd-${terraform.workspace}" = {
      id        = "admin-passwd-${terraform.workspace}"
      locations = ["us-east1"]
      # keys      = []
      # expire_time = "2023-01-25T00:00:00Z"
      # version_destroy_ttl = "86400s"
      secret_data = var.pulse-admin-passwd
      role       = "roles/secretmanager.secretAccessor"
      members  = [
        "${google_project_iam_member.member-role["roles/secretmanager.secretVersionManager"].member}",
        "serviceAccount:${data.google_project.project.number}-compute@developer.gserviceaccount.com"
      ]      
    }
  }
}


module "secret_manager_2" {
  source = "./modules/secret-manager"
  secrets = {
    "root-password-${terraform.workspace}" = {
      id        = "root-password-${terraform.workspace}"
      locations = ["us-east1"]
      # keys      = []
      # expire_time = "2023-01-25T00:00:00Z"
      # version_destroy_ttl = "86400s"
      secret_data = random_password.postgres_root_password_dappas.result
      role       = "roles/secretmanager.secretAccessor"
      members  = [
        "${google_project_iam_member.member-role["roles/secretmanager.secretVersionManager"].member}",
        "serviceAccount:${data.google_project.project.number}-compute@developer.gserviceaccount.com"
      ]      
    },
    "dbpasssecret-${terraform.workspace}" = {
      id        = "dbpasssecret-${terraform.workspace}"
      locations = ["us-east1"]
      # keys      = []
      # expire_time = "2023-01-25T00:00:00Z"
      # version_destroy_ttl = "86400s"
      secret_data = random_password.postgres_root_password_dappas.result
      role       = "roles/secretmanager.secretAccessor"
      members  = [
        "${google_project_iam_member.member-role["roles/secretmanager.secretVersionManager"].member}",
        "serviceAccount:${data.google_project.project.number}-compute@developer.gserviceaccount.com"
      ]      
    }  
  }
}




















# # Create a secret for the PostgreSQL root password in Secret Manager
# resource "google_secret_manager_secret" "root_password_dappas" {
#   #secret_id = "root-password-dappas-${var.env}"
#    secret_id ="${local.root_password_secret_id}"
#   replication {
#     user_managed {
#       replicas {
#         location = "us-east1"
#       }
#     }
#   }
# }

# # Attach secret data for root password secret using the generated password
# resource "google_secret_manager_secret_version" "root_password_dappas" {
#   secret      = google_secret_manager_secret.root_password_dappas.id
#   secret_data = random_password.postgres_root_password_dappas.result
# }
