resource "google_monitoring_notification_channel" "email" {
  for_each     = var.email_channels
  display_name = "${try(each.value.name_prefix, "yt-")}${each.key}-${terraform.workspace}"
  type         = "email"
  labels = {
    email_address = each.value.email_address
  }
}

