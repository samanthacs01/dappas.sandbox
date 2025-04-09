variable "email_channels" {
  description = "Map of email notification channels to create"
  type = map(object({
    email_address = string
    name_prefix   = optional(string, "yt-")
  }))
  default = {}
}