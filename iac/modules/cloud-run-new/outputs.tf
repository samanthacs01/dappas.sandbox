output "cloud_run_url" {
  description = "The URL of the Cloud Run service"
  value       = google_cloud_run_service.default.status[0].url
}

output "load_balancer_ip" {
  description = "The IP address of the Load Balancer"
  value       = google_compute_global_address.default.address
}

# output "iap_oauth2_client_id" {
#   description = "The OAuth2 client ID for IAP"
#   value       = google_iap_client.iap_client.client_id
# }

# output "iap_oauth2_client_secret" {
#   description = "The OAuth2 client secret for IAP"
#   value       = google_iap_client.iap_client.secret
# }

output "custom_domain" {
  value = var.custom_domain
}
