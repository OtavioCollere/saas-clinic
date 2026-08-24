resource "google_artifact_registry_repository" "cliniker" {
  location      = var.region
  repository_id = "cliniker"
  format        = "DOCKER"

  # Nenhuma politica de limpeza esta ativa hoje; o dry run fica ligado para que
  # criar uma politica no futuro nao apague imagem sem revisao.
  cleanup_policy_dry_run = true

  docker_config {
    immutable_tags = false
  }
}
