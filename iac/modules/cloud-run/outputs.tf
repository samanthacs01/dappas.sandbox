output "custom_domain" {
  description = "Custom domain for the Load Balancer."
  value       = local.gclb_create ? var.custom_domain : "none"
}

output "default_URL" {
  description = "Cloud Run service default URL."
  value       = module.cloud_run.service.uri
}

output "load_balancer_ip" {
  description = "LB IP that forwards to Cloud Run service."
  value       = local.gclb_create ? module.glb[0].address : "none"
}

output "connector" {
  description = "LB IP that forwards to Cloud Run service."
  value       = module.cloud_run.vpc_connector
}
