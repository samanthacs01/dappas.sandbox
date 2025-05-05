# Get GCP project name
data "google_project" "project" {
}

#Create Load Balancing Frontend
module "load-balancing-fe" {
  source                 = "./modules/cloud-run" 
  project_id             = var.gcp_project
  region                 = "us-east1"
  name                   = "${var.dappas_web_name}-${terraform.workspace}"
  custom_domain          = "${terraform.workspace}.${var.full_domain}"
  service_account        = "${data.google_project.project.number}-compute@developer.gserviceaccount.com"
  #connector             = google_sql_database_instance.db_dappas_instance.connection_name
  connector              = google_vpc_access_connector.priv_sql_dappas.id
  INSTANCE_CONNECTION_NAME = google_sql_database_instance.db_dappas_instance.connection_name
  #image                  = "gcr.io/google-samples/hello-app:1.0"
  image                  = "us-docker.pkg.dev/dappas/dappas/dappas-web-staging:latest"
  #image                   = "us-docker.pkg.dev/${var.gcp_project}/dappas/${var.dappas_web_name}-${terraform.workspace}:FRONTEND_TAG"
  allow_unauthenticated  = true

  volumes_config = {
    cloudsql_enabled = false
    gcs_enabled      = false
  }

  # Env variables
  env_vars = {
    NEXT_PUBLIC_APP_ENV             = terraform.workspace
    GOOGLE_GENERATIVE_AI_API_KEY    = "AIzaSyBucq34lPezSwK3eSj2eCuUj8mTAVJ1Mzo"
  }
}