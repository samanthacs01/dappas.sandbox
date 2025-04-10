variable "secrets" {
  type = map(object({
    id        = string
    locations = list(string)
    role      = string
    secret_data = string
    members = list(string)
    # keys      = list(string)
    # expire_time = string
    # version_destroy_ttl = string
  }))
}