output "load_balancer_ip" {
  description = "The IP address of the Load Balancer"
  value       = google_compute_global_address.default.address
}

output "custom_domain" {
  value = var.custom_domain
}
