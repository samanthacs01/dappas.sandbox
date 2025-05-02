variable "secrets" {
  type = map(object({
    id          = string            # The ID or name of the secret in Secret Manager.
    locations   = list(string)      # List of locations (GCP regions) where the secret is replicated.
    role        = string            # The role of IAM that will be given to those who agree to the secret. Eg: roles / secretmanager.secretAccessor.
    secret_data = string            # The real secret value you want to keep.
    members     = list(string)      # List of members (users or service accounts) who will have access.
  }))
}