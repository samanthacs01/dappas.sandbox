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


