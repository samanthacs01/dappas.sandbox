variable "bucket_name" {
  description = "Bucket name"
  type = map(string)
  default = {
    default = "tf-name"
    dev     = "dappas-docs-dev"
    staging = "dappas-docs-staging"
    production = "dappas-docs-production"
  }
}

variable "is_bucket_enabled" {
  description = "Condition to create bucket"
  type = map(string)
  default = {
    default = false
    dev = true
  }
}
