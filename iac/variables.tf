variable "gcp_project" {
  description = "Google Cloud project ID"
  type        = string
  default     = "dappas"
}

variable "gcp_region" {
  description = "Google Cloud region"
  type        = string
  default     = "us-east1"
}


# NETWORK

variable "vpc_name" {
  description = "VPC name"
  type = map(string)
  default = {
    default = "network"
    dev     = "dev-network"
    staging = "staging-network"
    production = "production-network"
  }
}

variable "is_vpc_enabled" {
  description = "Condition to create vpc"
  type = map(string)
  default = {
    default = "true"
  }
}

variable "subnet_name" {
  description = "Subnet name"
  type = map(string)
  default = {
    default = "subnet"
    dev     = "dev-subnet"
    staging = "staging-subnet"
    production = "production-subnet"
  }
}

variable "priv_sql_name" {
  description = "priv_sql name"
  type = map(string)
  default = {
    default = "priv_sql"
    dev     = "dev-priv-sql"
    staging = "staging-priv-sql"
    production = "production-priv-sql"
  }
}

variable "internal_address_name" {
  description = "internal_address_name"
  type = map(string)
  default = {
    default = "internal_addres"
    dev     = "dev-priv-sql"
    staging = "staging-internal-address"
    production = "production-internal-address"
  }
}

variable "nat_router_name" {
  description = "nat_router_name"
  type = map(string)
  default = {
    default = "nat-router"
    dev     = "dev-nat-router"
    staging = "staging-nat-router"
    production = "production-nat-router"
  }
}

variable "nat_config_name" {
  description = "nat_router_name"
  type = map(string)
  default = {
    default = "nat-config"
    dev     = "dev-nat-config"
    staging = "staging-nat-config"
    production = "production-nat-config"
  }
}

variable "cidr_dappas_subnet" {
  description = "cidr_dappas_subnet"
  type = map(string)
  default = {
    default = "10.0.0.0/28"
    dev     = "10.0.0.0/28"
    staging = "10.0.1.0/28"
    production = "10.0.2.0/28"
  }
}

variable "cidr_priv_sql_dappas" {
  description = "cidr_priv_sql_dappas"
  type = map(string)
  default = {
    default = "10.0.0.16/28"
    dev     = "10.0.0.16/28"
    staging = "10.0.1.16/28"
    production = "10.0.2.16/28"
  }
}

variable "internal_address_dappas" {
  description = "internal_address_dappas"
  type = map(string)
  default = {
    default = "10.0.0.5"
    dev     = "10.0.0.5"
    staging = "10.0.1.5"
    production = "10.0.2.5"
  }
}

# DATABASE

variable "region" {
  description = "Region where the instance will be created"
  type        = string
  default     = "us-east1"
}

variable "database_version" {
  description = "Version of the database engine"
  type        = string
  default     = "POSTGRES_16"
}


variable "deletion_protection" {
  description = "Configure accidental deletion protection for the instance"
  type        = bool
  default     = true
}

variable "db_tier" {
  description = "Database Tier"
  type        = string
  default     = "db-f1-micro"
}

variable "db_edition" {
  description = "Edition of the database"
  type        = string
  default     = "ENTERPRISE"
}

variable "db_availability" {
  description = "Availability Type"
  type        = string
  default     = "REGIONAL"
}

variable "db_backup_start_time" {
  description = "Time to start backup progress"
  type        = string
  default     = "03:00"
}

variable "retained_backups" {
  description = "Number of retained backups"
  type        = number
  default     = 15
}

variable "transaction_log_retention_days" {
  description = "Number of transaction log reteined"
  type        = number
  default     = 7
}

# SECRET MANAGER

variable "root_password_secret_id" {
  description = "root_password_secret_id"
  type = map(string)
  default = {
    default = "root-password"
    dev     = "root-password-dev"
    staging = "root-password-staging"
    production = "root-password-production"
  }
}

# BASTION HOST

variable "is_bastion_host_enabled" {
  description = "Condition to create bucket"
  type = map(string)
  default = {
    default = false
    dev = true
  }
}

variable "iap_acces_user" {
  description = "User with acces to IAP"
  type = map(string)
  default = {
    default = "samantha.cs@yareytech.com"
    dev     = "samantha.cs@yareytech.com"
  }
}

variable "vpn_ranges" {
  description = "list of allowed IP ranges for SSH access to the bastion host"
  type        = list(string)
  default = [
    "45.33.32.244/32",
    "45.79.29.134/32",
    "45.79.228.175/32",
    "139.144.55.144/32",
    "139.177.200.40/32",
    "139.177.200.210/32",
    "143.198.96.24/32"
  ]
}

# DNS 

variable "domain_zone_name" {
  description = "The name of manage domain zone"
  type        = string
  default     = "dappas-selector-dev"
}

variable "full_domain" {
  description = "The full domain name"
  type        = string
  default     = "dappas.selector.dev."
}

variable "domain" {
  description = "The domain name"
  type        = string
  default     = "dappas.selector.dev"
}


# CLOUD RUN FRONTEND

variable "dappas_web_name" {
  description = "name for the dappas web cloud run"
  type        = string
  default     = "dappas-web"
}

variable "session_expire_time" {
  description = "session expire time"
  type        = number
  default     = 2592000
}

variable "dappas_web_secret" {
  description = "secret for the frontend"
  type        = string
  sensitive   = true
  default     = "dhwuwefs"
  }
