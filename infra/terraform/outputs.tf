output "api_url" {
  description = "URL publica da API."
  value       = google_cloud_run_v2_service.api.uri
}

output "frontend_url" {
  description = "URL publica do frontend."
  value       = google_cloud_run_v2_service.frontend.uri
}

output "artifact_registry" {
  description = "Host do repositorio de imagens."
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.cliniker.repository_id}"
}

output "deploy_service_account" {
  description = "Valor do secret GCP_SA_EMAIL no GitHub."
  value       = google_service_account.github_deploy.email
}

output "wif_provider" {
  description = "Valor do secret WIF_PROVIDER no GitHub."
  value       = google_iam_workload_identity_pool_provider.github.name
}
