locals {
  bucket_name = lookup(var.bucket_name, terraform.workspace, var.bucket_name["default"])
  is_bucket_enabled = lookup(var.is_bucket_enabled, terraform.workspace, var.is_bucket_enabled["default"])
}