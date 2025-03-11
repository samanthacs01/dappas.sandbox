# Enable GCP provider version, Terraform CLI version
# is controlled by the pipeline
terraform {
  required_version = ">= 1.7.4"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 6.11.2, < 7.0.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = ">= 6.11.2, < 7.0.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "= 3.6.3"
    }
    null = {
      source  = "hashicorp/null"
      version = "= 3.2.3"
    }
  }
}

# Enable GCP provider
provider "google" {
  project = var.gcp_project
  region  = var.gcp_region
}

# Enable GCP-beta provider
provider "google-beta" {
  project = var.gcp_project
  region  = var.gcp_region
}

# Enable ramdom provider
provider "random" {
}

# Enable remote bucket for Terraform states
terraform {
  backend "gcs" {
    bucket = "tf-state-dappas"
    prefix = "/environments"
  }
}