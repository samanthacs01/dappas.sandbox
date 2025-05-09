# Create managed zone for the project.
resource "google_dns_managed_zone" "managed_zone" {
  name     = var.domain_zone_name
  dns_name = var.full_domain
  # Enable DNSSEC
  dnssec_config {
    state = "on"
  }
}

#Create A record for the frontend loadbalancer.
resource "google_dns_record_set" "cloud_run_fe" {
  name         = module.load-balancing-fe.custom_domain
  type         = "A"
  ttl          = 3600
  managed_zone = google_dns_managed_zone.managed_zone.name
  rrdatas      = [module.load-balancing-fe.load_balancer_ip]
  lifecycle {
    prevent_destroy = false
  }
  depends_on = [google_dns_managed_zone.managed_zone]
}

#Create A record for the react frontend loadbalancer.
resource "google_dns_record_set" "cloud_run_fe_react" {
  name         = module.load-balancing-fe-react.custom_domain
  type         = "A"
  ttl          = 3600
  managed_zone = google_dns_managed_zone.managed_zone.name
  rrdatas      = [module.load-balancing-fe.load_balancer_ip]
  lifecycle {
    prevent_destroy = false
  }
  depends_on = [google_dns_managed_zone.managed_zone]
}