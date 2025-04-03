resource "google_compute_instance" "bastion_host" {
  count = local.is_bastion_host_enabled ? 1 : 0
  name         = "bastion-host"
  project      = var.gcp_project
  machine_type = "e2-micro"
  zone         = "us-east1-b"

  boot_disk {
    initialize_params {
      image = "ubuntu-2204-jammy-v20250128"
    }
  }

  network_interface {
    network    = google_compute_network.dappas_network.name
    #subnetwork = "projects/dappas/regions/us-east1/subnetworks/dev-subnet"
    subnetwork = "projects/${var.gcp_project}/regions/${var.gcp_region}/subnetworks/${local.subnet_name}"
    #subnetwork = google_compute_subnetwork.dappas_subnet.name
    access_config {
      nat_ip = null
    }
  }

  metadata = {
    enable-oslogin = "FALSE"
  }

  metadata_startup_script = <<-EOF
    #!/bin/bash
    sudo apt-get update
    sudo apt-get install -y wget

    wget https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64 -O /usr/local/bin/cloud_sql_proxy
    chmod +x /usr/local/bin/cloud_sql_proxy

    cat <<EOT | sudo tee /etc/systemd/system/cloudsqlproxy.service
    [Unit]
    Description=Google Cloud SQL Auth Proxy

    [Service]
    Type=simple
    ExecStart=/usr/local/bin/cloud_sql_proxy -instances=${google_sql_database_instance.db_dappas_instance.connection_name}=tcp:0.0.0.0:5432
    Restart=always

    [Install]
    WantedBy=multi-user.target
    EOT

    sudo systemctl enable cloudsqlproxy.service
    sudo systemctl start cloudsqlproxy.service
  EOF

  service_account {
    email  = google_service_account.cloudsql_service_account.email
    scopes = ["https://www.googleapis.com/auth/cloud-platform"]
  }
}

resource "google_project_iam_member" "iap_access" {
  project = var.gcp_project
  role    = "roles/iap.tunnelResourceAccessor"
  member  = "user:${local.iap_acces_user}"
}

resource "google_compute_firewall" "allow_ssh" {
  name    = "allow-ssh-${terraform.workspace}"
  network = google_compute_network.dappas_network.name
  allow {
    protocol = "tcp"
    ports    = ["22"]
  }
  source_ranges = concat(var.vpn_ranges, ["35.235.240.0/20"])
}
