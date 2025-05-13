# Enable remote bucket for Terraform states
# Create remote bucket manually first
terraform {
  backend "gcs" {
    bucket  = "terraform-state-dappas"
    prefix  = "/enviroments"
  }
}