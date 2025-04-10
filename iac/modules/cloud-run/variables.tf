variable "custom_domain" {
  description = "Custom domain for the Load Balancer."
  type        = string
  default     = null
}

variable "name" {
  description = "name of the cloud run."
  type        = string
  default     = null
}

variable "iap" {
  description = "Identity-Aware Proxy for Cloud Run in the LB."
  type = object({
    enabled            = optional(bool, false)
    app_title          = optional(string, "Cloud Run Explore Application")
    oauth2_client_name = optional(string, "Test Client")
    email              = optional(string)
  })
  default = {}
}

variable "image" {
  description = "Container image to deploy."
  type        = string
}

variable "ingress" {
  description = "Ingress traffic sources allowed to call the service."
  type        = string
  default     = "INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER"
}

variable "project_create" {
  description = "Parameters for the creation of a new project."
  type = object({
    billing_account_id = string
    parent             = string
  })
  default = null
}

variable "project_id" {
  description = "Project ID."
  type        = string
}

variable "region" {
  description = "Cloud region where resource will be deployed."
  type        = string
  default     = "europe-west1"
}

variable "security_policy" {
  description = "Security policy (Cloud Armor) to enforce in the LB."
  type = object({
    enabled      = optional(bool, false)
    ip_blacklist = optional(list(string), ["*"])
    path_blocked = optional(string, "/login.html")
  })
  default = {}
}

variable "connector" {
  type        = string
  description = "declare the environment to be used"
}

variable "create_job" {
  description = "declare if its need it to create a job"
}

variable "service_account" {
  description = "declare the service account to be used"
}

variable "NEXT_APP_API_URL" {
  type        = string
  description = "URL for NextAuth authentication"
}

variable "NEXT_PUBLIC_SESSION_COOKIE_NAME" {
  type        = string
  description = "Secret key for NextAuth"
  sensitive   = true
}

variable "NEXT_PUBLIC_SOCKET_URL" {
  type        = string
  description = "URL for NextAuth socket"
}

variable "NEXTAUTH_URL" {
  type        = string
  description = "URL for NextAuth authentication"
}

variable "NEXTAUTH_SECRET" {
  type        = string
  description = "Secret key for NextAuth"
  sensitive   = true
}

variable "NEXTAUTH_SESSION_EXPIRE" {
  type        = number
  description = "Expire time for NextAuth"
}

variable "NEXT_PUBLIC_APP_ENV" {
  type        = string
  description = "Env variable for frontend"
}

variable "INSTANCE_CONNECTION_NAME" {
  type        = string
  description = "Cloud SQL instance connection name"
  sensitive   = true
}

variable "PROCESSOR_ENV" {
  type        = string
  description = "Document AI Processor environment"
}

variable "SUPPORT_EMAIL" {
  type        = string
  description = "Support email address"
}

variable "FRONTEND_BASE_URL" {
  type        = string
  description = "Frontend base URL"
}

variable "GOOGLE_APPLICATION_CREDENTIALS" {
  type        = string
  description = "Google Application credentials"
  sensitive   = true
}

variable "CLOUD_STORAGE_BUCKET_NAME" {
  type        = string
  description = "Bucket name for processing docs"
}

variable "CLOUD_PROJECT_ID" {
  type        = string
  description = "Cloud Project ID"
}

variable "CLOUD_PROJECT_NUMBER" {
  type        = string
  description = "Cloud Project number"
}

variable "DOCUMENT_AI_PROCESSOR_ID" {
  type        = string
  description = "Document AI processor ID"
  sensitive   = true
}

variable "DOCUMENT_AI_PROCESSOR_LOCATION" {
  type        = string
  description = "Document AI processor location"
}

variable "CLOUD_TASK_ID" {
  type        = string
  description = "Cloud Task ID for processing documents"
}

variable "FROM_EMAIL" {
  type        = string
  description = "From email"
}

variable "SESSION_EXPIRE" {
  type        = number
  description = "Backend session expire time"
}

variable "APP_ENV" {
  type        = string
  description = "Application Environment"
}

variable "BASE_URL" {
  type        = string
  description = "Base URL for API"
}

variable "DB_HOST" {
  type        = string
  description = "Private IP of DB host"
  sensitive   = true
}

variable "DB_USER" {
  type        = string
  description = "Secret key for NextAuth"
  sensitive   = true
}

variable "DB_PASS" {
  type        = string
  description = "Secret key for NextAuth"
  sensitive   = true
}

variable "DB_NAME" {
  type        = string
  description = "Secret key for NextAuth"
  sensitive   = true
}

variable "PULSE_ADMIN_PASSWORD" {
  type        = string
  description = "Secret key for NextAuth"
  sensitive   = true
}

variable "RESEND_API_KEY" {
  type        = string
  description = "Secret key for NextAuth"
  sensitive   = true
}

variable "cloud_sql_instances" {
  type        = string
  description = "Secret key for NextAuth"
  sensitive   = true
}

# variable "container_port" {
#   description = "declare the environment to be used"
#   default     = ""
# }

# variable "name_port" {
#   description = "declare the environment to be used"
#   default     = ""
# }

# variable "ports" {
#   description = "Declare the ports to be exposed by the Cloud Run service."
#   type = list(object({
#     container_port = optional(number)
#     name           = optional(string)
#   }))

#   # Provide a default value with an empty list of objects:
#   default = []
# }

variable "vpc_access" {
  type = object({
    connector = optional(string)
    egress    = optional(string)
    network   = optional(string)
    subnet    = optional(string)
    tags      = optional(list(string))
  })
  default = {}
}

variable "volumes" {
  description = "Named volumes in containers in name => attributes format."
  type = map(object({
    cloud_sql_instances = optional(list(string))
    gcs = optional(object({
      # needs revision.gen2_execution_environment
      bucket       = string
      is_read_only = optional(bool)
    }))
  }))
  default  = {}
  nullable = true
}

variable "volume_mounts" {
  description = "Optional mapping of volume mount names to their corresponding mount paths."
  type        = map(string)
  default     = {}
}

variable "bucket_name" {
  description = "to upload pdf for proccesing"
  default     = "dappas-docs"
}

variable "environment" {
  description = "declare the environment to be used"
  default     = ""
}
