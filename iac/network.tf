# Define your VPC network
resource "google_compute_network" "dappas_network" {
  auto_create_subnetworks = false
  name                    = "${local.vpc_name}"
  routing_mode            = "REGIONAL"
}

# Define a subnet within the VPC network
resource "google_compute_subnetwork" "dappas_subnet" {
  name          = "${local.subnet_name}"
  region        = "us-east1"
  ip_cidr_range = "${local.cidr_dappas_subnet}"
  network       = google_compute_network.dappas_network.id
}

# Define VPC peering
resource "google_compute_global_address" "private_ip_address_dappas" {
  name          = google_compute_network.dappas_network.name
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.dappas_network.id
}

# Define Service Networking Connection
resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = google_compute_network.dappas_network.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_address_dappas.name]
}

# Define Networking connection
resource "google_vpc_access_connector" "priv_sql_dappas" {
  name          = "${local.priv_sql_name}" 
  region        = var.gcp_region
  network       = google_compute_network.dappas_network.id
  min_instances = 2
  max_instances = 3
  ip_cidr_range = "${local.cidr_priv_sql_dappas}"
}

# Define IP address for the vpc connector
resource "google_compute_address" "internal_address_dappas" {
  project      = var.gcp_project
  name         = "${local.internal_address_name}"
  region       = var.gcp_region
  address_type = "INTERNAL"
  address      = "${local.internal_address_dappas}"
  subnetwork   = google_compute_subnetwork.dappas_subnet.name
}

resource "google_compute_router" "nat_router" {
  name    = "${local.nat_router_name}"
  region  = var.gcp_region
  network = google_compute_network.dappas_network.id
}

resource "google_compute_router_nat" "nat_config" {
  name                               = "${local.nat_config_name}"
  router                             = google_compute_router.nat_router.name
  region                             = google_compute_router.nat_router.region
  nat_ip_allocate_option             = "AUTO_ONLY"
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"
}