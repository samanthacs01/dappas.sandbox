output "secrets" {
  value = {
    for key, secret in var.secrets : 
    key => {
      id        = secret.id
      locations = secret.locations
      role      = secret.role
      secret_data  = secret.secret_data 
      members = secret.members
    }
  }
}