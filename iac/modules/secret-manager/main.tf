# Get GCP project name
data "google_project" "project" {
}

locals {
  secrets = var.secrets
}

# Secret without version
resource "google_secret_manager_secret" "default" {
  for_each    = local.secrets
  secret_id   = each.value.id
  replication {
    user_managed {
      replicas {
        location = each.value.locations[0]
      }
    }
  }
}

# Version of the secret, which really stores the secret value.
resource "google_secret_manager_secret_version" "default" {
  for_each    = local.secrets
  secret      = google_secret_manager_secret.default[each.key].id
  secret_data = each.value.secret_data
}

# Permission access to the secret
resource "google_secret_manager_secret_iam_binding" "secret_access" {
  for_each    = local.secrets
  secret_id   = google_secret_manager_secret.default[each.key].id
  role        = each.value.role
  members     = each.value.members
}
