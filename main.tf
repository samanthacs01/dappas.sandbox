# Get GCP project name
data "google_project" "project" {
}

resource "google_storage_bucket" "gcs-upload" {
    count = local.is_bucket_enabled ? 1 : 0
  name          = "${local.bucket_name}"
  location      = "us-east1"
  storage_class = "STANDARD"
}