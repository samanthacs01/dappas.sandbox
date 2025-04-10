# HIGH CPU
resource "google_monitoring_alert_policy" "cloudsql_cpu_high" {
  display_name = "High CPU - ${local.instance_name}"
  combiner     = "OR"

  conditions {
    display_name = "CPU > 85% - ${local.instance_name}"

    condition_threshold {
      filter = <<-EOT
        resource.type = "cloudsql_database" AND
        metric.type = "cloudsql.googleapis.com/database/cpu/utilization" AND
        resource.labels."database_id" = "${var.gcp_project}:${local.instance_name}"
      EOT
      duration        = "300s"  # 5 min
      comparison      = "COMPARISON_GT"
      threshold_value = 0.85    # 85%
      aggregations {
        alignment_period   = "60s"
        per_series_aligner = "ALIGN_MEAN"
      }
    }
  }

  notification_channels = values(module.notification_channels.channel_names)

documentation {
  content = <<-EOT
    Instance ${local.instance_name} has exceeded 85% CPU usage for more than 5 minutes.

    Recommended actions:
    1. Check active queries in Cloud SQL
    2. Review performance dashboard
    3. Consider query optimization or scaling

    Direct link: https://console.cloud.google.com/sql/instances/${local.instance_name}/overview
  EOT
  mime_type = "text/markdown"
 }
}


# HIGH DISK
resource "google_monitoring_alert_policy" "cloudsql_disk_high" {
  display_name = "High Disk - ${local.instance_name}"
  combiner     = "OR"

  conditions {
    display_name = "Disk > 85% - ${local.instance_name}"

    condition_threshold {
      filter = <<-EOT
        resource.type = "cloudsql_database" AND
        metric.type = "cloudsql.googleapis.com/database/disk/utilization" AND
        resource.labels."database_id" = "${var.gcp_project}:${local.instance_name}"
      EOT
      duration        = "300s"  # 5 min
      comparison      = "COMPARISON_GT"
      threshold_value = 0.85    # 85%
      aggregations {
        alignment_period   = "60s"
        per_series_aligner = "ALIGN_MEAN"
      }
    }
  }

  notification_channels = values(module.notification_channels.channel_names)

  documentation {
    content = <<-EOT
      Instance ${local.instance_name} has exceeded 85% disk usage for more than 5 minutes.

      Recommended actions:
      1. Check storage usage and clean up if possible
      2. Review auto-storage increase settings
      3. Consider scaling up disk size
      4. Verify binary logs/backups aren't consuming excessive space

      Direct link: https://console.cloud.google.com/sql/instances/${local.instance_name}/storage
    EOT
    mime_type = "text/markdown"
  }
}


# HIGH MEMORY
resource "google_monitoring_alert_policy" "cloudsql_memory_high" {
  display_name = "High Memory - ${local.instance_name}"
  combiner     = "OR"

  conditions {
    display_name = "Memory Usage High - ${local.instance_name}"

    condition_threshold {
      filter = <<-EOT
        resource.type = "cloudsql_database" AND
        metric.type = "cloudsql.googleapis.com/database/memory/usage" AND
        resource.labels."database_id" = "${var.gcp_project}:${local.instance_name}"
      EOT
      duration        = "300s"  # 5 min
      comparison      = "COMPARISON_GT"
      threshold_value = 550000000    
      aggregations {
        alignment_period   = "60s"
        per_series_aligner = "ALIGN_MEAN"
      }
    }
  }

  notification_channels = values(module.notification_channels.channel_names)

  documentation {
    content = <<-EOT
      Instance ${local.instance_name} has exceeded 85% memory usage for more than 5 minutes.

      Recommended actions:
      1. Check active queries for memory leaks
      2. Review performance dashboard
      3. Optimize memory-intensive queries
      4. Consider upgrading to a machine type with more memory

      Direct link: https://console.cloud.google.com/sql/instances/${local.instance_name}/overview
    EOT
    mime_type = "text/markdown"
  }
}


# INSTANCE STATE

resource "google_monitoring_alert_policy" "cloudsql_critical_states" {
  display_name = "Critical State - ${local.instance_name}"
  combiner     = "OR"

  conditions {
    display_name = "Instance in Critical State - ${local.instance_name}"

#     condition_threshold {
#       filter = <<-EOT
#         resource.type = "cloudsql_database" AND
#         metric.type = "cloudsql.googleapis.com/database/instance_state" AND
#         resource.labels.database_id = "${var.gcp_project}:${local.instance_name}" AND
#         metric.state = one_of("SUSPENDED", "FAILED", "MAINTENANCE", "UNKNOWN_STATE")
#       EOT
#       threshold_value = 0.5  # Para métricas booleanas, >0.5 significa TRUE
#       duration       = "60s" # Alerta inmediata al detectar el estado
#       comparison     = "COMPARISON_GT"

#       trigger {
#         count = 1
#       }
#     }
#   }

  condition_monitoring_query_language {
      query = <<-EOT
        fetch cloudsql_database
        | metric 'cloudsql.googleapis.com/database/instance_state'
        | filter (resource.database_id == '${var.gcp_project}:${local.instance_name}')
        | filter (metric.state == 'SUSPENDED' 
               || metric.state == 'FAILED' 
               || metric.state == 'MAINTENANCE' 
               || metric.state == 'UNKNOWN_STATE'
               || metric.state == 'RUNNABLE')
        | align next_older(1m)
        | every(1m)
      EOT
      duration = "0s"  # Alerta inmediata
      trigger {
        count = 1
      }
    }
  }

  notification_channels = values(module.notification_channels.channel_names)

  documentation {
    content = <<-EOT
      Instance ${local.instance_name} has entered a critical state:
      
      Possible states triggering this alert:
      - SUSPENDED: Instance suspended (check billing)
      - FAILED: Critical failure detected
      - MAINTENANCE: Under maintenance
      - UNKNOWN_STATE: State cannot be determined
      
      Immediate actions required:
      1. Verify instance status in Cloud Console
      2. Check logs for errors
      3. Contact support if needed
      
      Direct link: https://console.cloud.google.com/sql/instances/${local.instance_name}/overview
    EOT
    mime_type = "text/markdown"
  }
}


# resource "google_monitoring_alert_policy" "cloudsql_connections_high" {
#   display_name = "High Connections - ${local.instance_name}"
#   combiner     = "OR"

#   conditions {
#     display_name = "Connection Count High - ${local.instance_name}"

#     condition_threshold {
#       filter = <<-EOT
#         resource.type = "cloudsql_database" AND
#         metric.type = "cloudsql.googleapis.com/database/postgresql/connections" AND
#         resource.labels."database_id" = "${var.gcp_project}:${local.instance_name}"
#       EOT
#       duration        = "300s"  # 5 min
#       comparison      = "COMPARISON_GT"
#       threshold_value = 25
#       aggregations {
#         alignment_period   = "60s"
#         per_series_aligner = "ALIGN_MEAN"
#       }
#     }
#   }

#   notification_channels = values(module.notification_channels.channel_names)

#   documentation {
#     content = <<-EOT
#       Instance ${local.instance_name} has exceeded the connection threshold for more than 5 minutes.

#       Recommended actions:
#       1. Check for connection leaks in application code
#       2. Review active connections
#       3. Consider increasing max_connections parameter if needed
#       4. Optimize connection pooling settings
#       5. Scale up the instance if consistently hitting limits

#       Direct link: https://console.cloud.google.com/sql/instances/${local.instance_name}/overview
#     EOT
#     mime_type = "text/markdown"
#   }
# }