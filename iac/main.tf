# Get GCP project name
data "google_project" "project" {
}

# Data Definition for Forntend env vars

data "google_secret_manager_secret_version" "ai_api_key" {
  secret  = "google_generative_ai_api_key_${terraform.workspace}"
  version = "latest"
}

data "google_secret_manager_secret_version" "next_public_amplitude_api_key" {
  secret  = "next_public_amplitude_api_key_${terraform.workspace}"
  version = "latest"
}

data "google_secret_manager_secret_version" "shopify_store_domain" {
  secret  = "shopify_store_domain_${terraform.workspace}"
  version = "latest"
}

data "google_secret_manager_secret_version" "shopify_storefront_acces_token" {
  secret  = "shopify_storefront_acces_token_${terraform.workspace}"
  version = "latest"
}

data "google_secret_manager_secret_version" "vercel_project_production_url" {
  secret  = "vercel_project_production_url_${terraform.workspace}"
  version = "latest"
}

data "google_secret_manager_secret_version" "vercel_project_production_url_react" {
  secret  = "vercel_project_production_url__react_${terraform.workspace}"
  version = "latest"
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
  #image                  = "us-docker.pkg.dev/dappas-459214/dappas/dappas-web-staging:latest"
  image                   = "us-docker.pkg.dev/${var.gcp_project}/dappas/${var.dappas_web_name}-${terraform.workspace}:FRONTEND_NEXT_TAG"
  allow_unauthenticated  = true

  volumes_config = {
    cloudsql_enabled = false
    gcs_enabled      = false
  }

  # Env variables
  env_vars = {
    GOOGLE_GENERATIVE_AI_API_KEY    = data.google_secret_manager_secret_version.ai_api_key.secret_data
    NEXT_PUBLIC_AMPLITUDE_API_KEY   = data.google_secret_manager_secret_version.next_public_amplitude_api_key.secret_data
    SHOPIFY_STORE_DOMAIN            = data.google_secret_manager_secret_version.shopify_store_domain.secret_data
    SHOPIFY_STOREFRONT_ACCESS_TOKEN = data.google_secret_manager_secret_version.shopify_storefront_acces_token.secret_data
    VERCEL_PROJECT_PRODUCTION_URL   = data.google_secret_manager_secret_version.vercel_project_production_url.secret_data
  }
}


#Create Load Balancing Frontend REACT
module "load-balancing-fe-react" {
  source                 = "./modules/cloud-run" 
  project_id             = var.gcp_project
  region                 = "us-east1"
  name                   = "web-${var.dappas_web_name}-${terraform.workspace}"
  custom_domain          = "web.${terraform.workspace}.${var.full_domain}"
  service_account        = "${data.google_project.project.number}-compute@developer.gserviceaccount.com"
  #connector             = google_sql_database_instance.db_dappas_instance.connection_name
  connector              = google_vpc_access_connector.priv_sql_dappas.id
  INSTANCE_CONNECTION_NAME = google_sql_database_instance.db_dappas_instance.connection_name
  container_port         = "80"
  #image                  = "gcr.io/google-samples/hello-app:1.0"
  #image                  = "us-docker.pkg.dev/dappas-459214/dappas/dappas-web-react-dev:latest"
  image                   = "us-docker.pkg.dev/${var.gcp_project}/dappas/${var.dappas_web_name_react}-${terraform.workspace}:FRONTEND_REACT_TAG"
  allow_unauthenticated  = true

  volumes_config = {
    cloudsql_enabled = false
    gcs_enabled      = false
  }

  # Env variables
  env_vars = {
    GOOGLE_GENERATIVE_AI_API_KEY    = data.google_secret_manager_secret_version.ai_api_key.secret_data
    VITE_AMPLITUDE_API_KEY   = data.google_secret_manager_secret_version.next_public_amplitude_api_key.secret_data
    VITE_SHOPIFY_STORE_DOMAIN            = data.google_secret_manager_secret_version.shopify_store_domain.secret_data
    VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN = data.google_secret_manager_secret_version.shopify_storefront_acces_token.secret_data
    VITE_VERCEL_PROJECT_PRODUCTION_URL   = data.google_secret_manager_secret_version.vercel_project_production_url_react.secret_data
  }
}
