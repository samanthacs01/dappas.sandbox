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



# Create Cloud Run for the frontend
module "load-balancing-fe" {
  source              = "./modules/cloud-run"
  project_id          = var.gcp_project
  region              = "us-east1"
  name                = "${var.dappas_web_name}-${terraform.workspace}"
  custom_domain       = "${terraform.workspace}.${var.full_domain}"
  ingress             = "INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER"
  create_job          = false
  cloud_sql_instances = ""
  service_account     = "${data.google_project.project.number}-compute@developer.gserviceaccount.com"
  connector           = google_sql_database_instance.db_dappas_instance.connection_name
  #image               = "us-docker.pkg.dev/${var.gcp_project}/pulse/${var.dappas_web_name}-${terraform.workspace}:FRONTEND_TAG"
  image               = "us-docker.pkg.dev/cloudrun/container/hello"

  # Frontend vars required
  NEXT_APP_API_URL                = "https://api.${terraform.workspace}.${var.domain}"
  NEXT_PUBLIC_SESSION_COOKIE_NAME = "${var.dappas_web_name}-session"
  NEXT_PUBLIC_SOCKET_URL          = "https://api.${terraform.workspace}.${var.domain}"
  NEXTAUTH_URL                    = "https://${terraform.workspace}.${var.domain}"
  NEXTAUTH_SECRET                 = var.dappas_web_secret
  NEXTAUTH_SESSION_EXPIRE         = var.session_expire_time
  NEXT_PUBLIC_APP_ENV             = "${terraform.workspace}"

  # Backend vars required
  INSTANCE_CONNECTION_NAME       = null
  PROCESSOR_ENV                  = ""
  SUPPORT_EMAIL                  = ""
  FRONTEND_BASE_URL              = ""
  GOOGLE_APPLICATION_CREDENTIALS = ""
  CLOUD_STORAGE_BUCKET_NAME      = ""
  CLOUD_PROJECT_ID               = ""
  CLOUD_PROJECT_NUMBER           = ""
  DOCUMENT_AI_PROCESSOR_ID       = ""
  DOCUMENT_AI_PROCESSOR_LOCATION = ""
  CLOUD_TASK_ID                  = ""
  FROM_EMAIL                     = ""
  SESSION_EXPIRE                 = null
  APP_ENV                        = ""
  BASE_URL                       = ""
  DB_HOST                        = google_sql_database_instance.db_dappas_instance.private_ip_address
  # Backend secrets vars required
  DB_USER              = module.secret_manager.secrets["dbusersecret-${terraform.workspace}"].id
  DB_PASS              = module.secret_manager_2.secrets["dbpasssecret-${terraform.workspace}"].id 
  DB_NAME              = module.secret_manager.secrets["dbnamesecret-${terraform.workspace}"].id 
  PULSE_ADMIN_PASSWORD = module.secret_manager.secrets["admin-passwd-${terraform.workspace}"].id 
  RESEND_API_KEY       = module.secret_manager.secrets["resend-api-key-${terraform.workspace}"].id  
  # DB_USER              = google_secret_manager_secret.dbuser_pulse.secret_id
  # DB_PASS              = google_secret_manager_secret.dbpass_pulse.secret_id
  # DB_NAME              = google_secret_manager_secret.dbname_pulse.secret_id
  # PULSE_ADMIN_PASSWORD = google_secret_manager_secret.pulse_admin_passwd.secret_id
  # RESEND_API_KEY       = google_secret_manager_secret.resend_api_key.secret_id
}