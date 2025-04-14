# Get GCP project name
data "google_project" "project" {
}

module "bucket_test" {
  source = "./modules/s3_bucket"
}


# # Create scheduler job to run the backend worker
# resource "google_pubsub_topic" "cloud_run_scheduler_topic" {
#   name = "cloud-run-scheduler-topic-${terraform.workspace}"
# }

# resource "google_cloud_scheduler_job" "cloud_run_scheduler_job" {
#   name        = "cloud-run-scheduler-job-${terraform.workspace}"
#   description = "Scheduler for Cloud Run Service"
#   schedule    = "*/1 * * * *"
#   time_zone   = "UTC"
#   pubsub_target {
#     topic_name = google_pubsub_topic.cloud_run_scheduler_topic.id
#     data       = base64encode(jsonencode({ "message" : "Run Cloud Run Service" }))
#   }
# }

# resource "google_pubsub_subscription" "cloud_run_scheduler_subscription" {
#   name  = "cloud-run-scheduler-subscription-${terraform.workspace}"
#   topic = google_pubsub_topic.cloud_run_scheduler_topic.name
#   push_config {
#     push_endpoint = "https://api.${terraform.workspace}.${var.domain}/worker/process_documents"
#     oidc_token {
#       service_account_email = google_service_account.cloudsql_service_account.email
#     }
#   }
# }



module "load-balancing-fe" {
  source                 = "./modules/cloud-run-new" 
  project_id             = var.gcp_project
  region                 = "us-east1"
  name                   = "frontend-api-${terraform.workspace}"
  custom_domain          = "api.${terraform.workspace}.${var.full_domain}"
  service_account        = "${data.google_project.project.number}-compute@developer.gserviceaccount.com"
  image                  = "gcr.io/google-samples/hello-app:1.0"
  allow_unauthenticated  = true
  connector              = google_sql_database_instance.db_dappas_instance.connection_name

  # Security
  security_policy = {
    ip_blacklist = ["1.2.3.4", "5.6.7.8"] # Puedes dejar vacío con []
  }



  # Variables de entorno
env_vars = {
  NEXT_APP_API_URL                 = "https://api.${terraform.workspace}.${var.full_domain}"
  NEXT_PUBLIC_SESSION_COOKIE_NAME = "frontend-api-session"
  NEXT_PUBLIC_SOCKET_URL          = "https://api.${terraform.workspace}.${var.full_domain}"
  NEXTAUTH_URL                    = "https://api.${terraform.workspace}.${var.full_domain}"
  NEXTAUTH_SECRET                 = var.dappas_web_secret
  NEXTAUTH_SESSION_EXPIRE         = var.session_expire_time
  NEXT_PUBLIC_APP_ENV             = terraform.workspace
}
}