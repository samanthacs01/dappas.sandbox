variable "bucket_name" {
  description = "Bucket name"
  type = map(string)
  default = {
    default = "tf-name"
    dev     = "dev-bucket"
    staging = "staging-bucket"
    production = "production-bucket"
  }
}

variable "is_bucket_enabled" {
  description = "Condition to create bucket"
  type = map(string)
  default = {
    default = false
  }
}
