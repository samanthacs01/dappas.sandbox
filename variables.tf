variable "gcp_project" {
  description = "Google Cloud project ID"
  type        = string
  default     = "dappas"
}

variable "gcp_region" {
  description = "Google Cloud region"
  type        = string
  default     = "us-east1"
}

variable "bucket_name" {
  description = "Bucket name"
  type = map(string)
  default = {
    default = "tf-name"
    dev     = "dev-bucket"
    staging = "staging-bucket"
  }
}

variable "is_bucket_enabled" {
  description = "Condition to create bucket"
  type = map(string)
  default = {
    default = "true"
    dev     = false
  }
}