# Enable remote bucket for Terraform states
# Create remote bucket manually first
terraform {
  backend "gcs" {
    bucket  = "tf-state-dappas-turbo-repo"
    prefix  = "/enviroments"
  }
}