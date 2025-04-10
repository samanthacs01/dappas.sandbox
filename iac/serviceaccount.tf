locals {
  services = toset([
    "run.googleapis.com",
    "compute.googleapis.com",
    "secretmanager.googleapis.com",
    "dns.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "cloudbuild.googleapis.com",
    "serviceusage.googleapis.com",
    "artifactregistry.googleapis.com",
    "vpcaccess.googleapis.com",
    "documentai.googleapis.com",
    "cloudscheduler.googleapis.com",
    "pubsub.googleapis.com",
    "cloudtasks.googleapis.com",
    "iam.googleapis.com",
    "storage.googleapis.com",
    "iap.googleapis.com",
    "networkmanagement.googleapis.com",
    "servicenetworking.googleapis.com",
    "vpcaccess.googleapis.com"
  ])
}

resource "google_project_service" "enabled_service" {
  for_each = toset(local.services)
  project  = var.gcp_project
  service  = each.key
  provisioner "local-exec" {
    command = "sleep 60"
  }
  provisioner "local-exec" {
    when    = destroy
    command = "sleep 15"
  }
  disable_on_destroy         = false
  disable_dependent_services = false
}

# Enable Cloud SQL API
resource "google_project_service" "sqladmin_api" {
  service            = "sqladmin.googleapis.com"
  disable_on_destroy = false
}

resource "google_service_account" "cloudsql_service_account" {
  project      = var.gcp_project
  account_id   = "csql-sa-${terraform.workspace}-id"
  #account_id   = "csql-sa-${var.env}-id"
  display_name = "Service Account for Cloud SQL"
}


# Set roles for Cloud SQL service account
resource "google_project_iam_member" "member-role" {
  depends_on = [google_service_account.cloudsql_service_account]
  for_each = toset([
    "roles/cloudsql.client",
    "roles/cloudsql.editor",
    "roles/cloudsql.admin",
    "roles/secretmanager.secretAccessor",
    "roles/secretmanager.secretVersionManager",
    "roles/vpcaccess.serviceAgent",
    "roles/storage.objectCreator",
    "roles/storage.admin",
    "roles/documentai.admin",
    "roles/cloudscheduler.admin",
    "roles/cloudtasks.admin"
  ])
  role    = each.key
  project = var.gcp_project
  member  = "serviceAccount:${google_service_account.cloudsql_service_account.email}"
}

