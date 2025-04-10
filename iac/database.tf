# Create Cloud SQL database instance
resource "google_sql_database_instance" "db_dappas_instance" {
  name             = "${local.instance_name}"
  region           = var.region
  database_version = var.database_version
  #root_password    = google_secret_manager_secret_version.root_password_dappas.secret_data
  root_password    = module.secret_manager_2.secrets["root-password-${terraform.workspace}"].secret_data
  settings {
    tier              = var.db_tier
    edition           = var.db_edition
    availability_type = "REGIONAL"
    # backup_configuration = !local.is_dev ? {
    backup_configuration {
      enabled                        = true
      start_time                     = var.db_backup_start_time
      point_in_time_recovery_enabled = true
      location                       = var.region
      transaction_log_retention_days = var.transaction_log_retention_days
      backup_retention_settings {
        retained_backups = var.retained_backups
      }
    }
    ip_configuration {
      ipv4_enabled    = false
      private_network = google_compute_network.dappas_network.id
    }
    password_validation_policy {
      min_length                  = 6
      complexity                  = "COMPLEXITY_DEFAULT"
      reuse_interval              = 2
      disallow_username_substring = true
      enable_password_policy      = true
    }
  }
  deletion_protection = var.deletion_protection
  depends_on = [google_service_networking_connection.private_vpc_connection]
}

# Create Cloud SQL database
resource "google_sql_database" "db_dappas" {
  name       = "${local.db_name}"
  instance   = google_sql_database_instance.db_dappas_instance.name
  depends_on = [google_sql_database_instance.db_dappas_instance]
}
