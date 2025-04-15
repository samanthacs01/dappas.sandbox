data "google_project" "project" {
}

locals {
  secrets = var.secrets
}

resource "google_secret_manager_secret" "default" {
  for_each            = local.secrets
  #project             = var.project_id
  secret_id           = each.value.id
  #labels              = lookup(var.labels, each.key, null)
  replication {
    user_managed {
      replicas {
        location = each.value.locations[0]
      }
    }
  }
  #expire_time         = each.value.expire_time
  #version_destroy_ttl = each.value.version_destroy_ttl
}

resource "google_secret_manager_secret_version" "default" {
  for_each = local.secrets

  secret      = google_secret_manager_secret.default[each.key].id
  secret_data = each.value.secret_data
}

 resource "google_secret_manager_secret_iam_binding" "secretaccess" {
  for_each = local.secrets

  secret_id = google_secret_manager_secret.default[each.key].id
  role      = each.value.role
  
  members = each.value.members
}
