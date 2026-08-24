locals {
  # SA padrao do Compute, usada como identidade de runtime dos dois servicos.
  runtime_service_account = "${var.project_number}-compute@developer.gserviceaccount.com"

  image_prefix = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.cliniker.repository_id}"
}

resource "google_cloud_run_v2_service" "api" {
  name     = "cliniker-api"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  deletion_protection = true

  scaling {
    min_instance_count = 0
  }

  template {
    service_account                  = local.runtime_service_account
    timeout                          = "300s"
    max_instance_request_concurrency = 80

    scaling {
      max_instance_count = 3
    }

    containers {
      image = "${local.image_prefix}/api:${var.api_image_tag}"

      ports {
        name           = "http1"
        container_port = 8080
      }

      resources {
        limits = {
          cpu    = "1000m"
          memory = "512Mi"
        }
        cpu_idle          = true
        startup_cpu_boost = true
      }

      startup_probe {
        failure_threshold = 1
        period_seconds    = 240
        timeout_seconds   = 240

        tcp_socket {
          port = 8080
        }
      }
    }
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }

  # As env vars e a tag da imagem sao definidas pelo workflow de deploy
  # (--env-vars-file). Sem ignorar, um apply do Terraform limparia as env vars
  # e faria rollback da imagem para a tag fixada em variables.tf.
  lifecycle {
    ignore_changes = [
      template[0].containers[0].image,
      template[0].containers[0].env,
      client,
      client_version,
    ]
  }
}

resource "google_cloud_run_v2_service" "frontend" {
  name     = "cliniker-frontend"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  deletion_protection = true

  scaling {
    min_instance_count = 0
  }

  template {
    service_account                  = local.runtime_service_account
    timeout                          = "300s"
    max_instance_request_concurrency = 80

    scaling {
      max_instance_count = 3
    }

    containers {
      image = "${local.image_prefix}/web:${var.web_image_tag}"

      ports {
        name           = "http1"
        container_port = 8080
      }

      resources {
        limits = {
          cpu    = "1000m"
          memory = "512Mi"
        }
        cpu_idle          = true
        startup_cpu_boost = true
      }

      startup_probe {
        failure_threshold = 1
        period_seconds    = 240
        timeout_seconds   = 240

        tcp_socket {
          port = 8080
        }
      }
    }
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }

  lifecycle {
    ignore_changes = [
      template[0].containers[0].image,
      template[0].containers[0].env,
      client,
      client_version,
    ]
  }
}

resource "google_cloud_run_v2_service_iam_member" "api_public" {
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.api.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_cloud_run_v2_service_iam_member" "frontend_public" {
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.frontend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
