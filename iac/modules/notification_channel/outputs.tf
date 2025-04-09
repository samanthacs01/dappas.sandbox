output "channel_names" {
  description = "Map of channel names to their resource references"
  value       = { for k, v in google_monitoring_notification_channel.email : k => v.name }
}