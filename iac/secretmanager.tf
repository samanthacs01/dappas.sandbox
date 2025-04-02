resource "random_password" "postgres_root_password_dappas" {
  length      = 16
  special     = true
  min_upper   = 2
  min_lower   = 2
  min_numeric = 2
  min_special = 2
}

# Create a secret for the PostgreSQL root password in Secret Manager
resource "google_secret_manager_secret" "root_password_dappas" {
  #secret_id = "root-password-dappas-${var.env}"
   secret_id ="${local.root_password_secret_id}"
  replication {
    user_managed {
      replicas {
        location = "us-east1"
      }
    }
  }
}

# Attach secret data for root password secret using the generated password
resource "google_secret_manager_secret_version" "root_password_dappas" {
  secret      = google_secret_manager_secret.root_password_dappas.id
  secret_data = random_password.postgres_root_password_dappas.result
}
