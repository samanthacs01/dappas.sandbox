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
      secret_data = google_sql_database.db_dappas.name
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
      secret_data = random_password.postgres_root_password_dappas.result
      role       = "roles/secretmanager.secretAccessor"
      members  = [
        "${google_project_iam_member.member-role["roles/secretmanager.secretVersionManager"].member}",
        "serviceAccount:${data.google_project.project.number}-compute@developer.gserviceaccount.com"
      ]      
    }  
  }
}









