# Get GCP project name
data "google_project" "project" {
}

module "bucket_test" {
  source = "./modules/s3_bucket"
}