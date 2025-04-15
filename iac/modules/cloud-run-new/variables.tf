variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "region" {
  description = "The GCP region"
  type        = string
}

variable "name" {
  description = "The name of the Cloud Run service"
  type        = string
}

variable "image" {
  description = "Docker image to deploy on Cloud Run"
  type        = string
}

variable "custom_domain" {
  description = "Custom domain for Cloud Run and Load Balancer"
  type        = string
}

variable "security_policy" {
  description = "Configuration for Cloud Armor security policy"
  type = object({
    ip_blacklist = list(string)
  })
  default = {
    ip_blacklist = []
  }
}

variable "env_vars" {
  type        = map(string)
  default     = {}
  description = "Mapa de variables de entorno para el contenedor de Cloud Run"
}

variable "ingress" {
  description = "Ingress traffic sources allowed to call the service."
  type        = string
  default     = "INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER"
}

variable "allow_unauthenticated" {
  description = "Si es true, permite invocación sin autenticación (rol run.invoker para allUsers)"
  type        = bool
  default     = false
}

variable "service_account" {
  description = "declare the service account to be used"
}

variable "connector" {
  description = "VPC connector for Cloud Run to access resources"
  type        = string
}

variable "cpu_limit" {
  description = "Amount of CPU to allocate (e.g. 1000m = 1 vCPU)"
  type        = string
  default     = "2000m"
}

variable "memory_limit" {
  description = "Amount of memory to allocate (e.g. 512Mi, 1Gi)"
  type        = string
  default     = "2Gi"
}

variable "INSTANCE_CONNECTION_NAME" {
  type        = string
  description = "Cloud SQL instance connection name"
  sensitive   = true
}

variable "bucket_name" {
  description = "to upload pdf for proccesing"
  default     = "dappas-docs-dev"
}