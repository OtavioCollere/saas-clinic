# Blocos de import: o estado comeca vazio e adota o que ja esta no ar.
# Depois do primeiro `terraform apply` bem sucedido este arquivo pode ser
# apagado -- os recursos ja estarao no state.

import {
  to = google_artifact_registry_repository.cliniker
  id = "projects/bianca-saas/locations/southamerica-east1/repositories/cliniker"
}

import {
  to = google_service_account.github_deploy
  id = "projects/bianca-saas/serviceAccounts/github-deploy@bianca-saas.iam.gserviceaccount.com"
}

import {
  to = google_iam_workload_identity_pool.github
  id = "projects/bianca-saas/locations/global/workloadIdentityPools/github-pool"
}

import {
  to = google_iam_workload_identity_pool_provider.github
  id = "projects/bianca-saas/locations/global/workloadIdentityPools/github-pool/providers/github-provider"
}

import {
  to = google_service_account_iam_member.github_deploy_wif["OtavioCollere/saas-clinic"]
  id = "projects/bianca-saas/serviceAccounts/github-deploy@bianca-saas.iam.gserviceaccount.com roles/iam.workloadIdentityUser principalSet://iam.googleapis.com/projects/769327558062/locations/global/workloadIdentityPools/github-pool/attribute.repository/OtavioCollere/saas-clinic"
}

import {
  to = google_service_account_iam_member.github_deploy_wif["OtavioCollere/clinic-full-stack"]
  id = "projects/bianca-saas/serviceAccounts/github-deploy@bianca-saas.iam.gserviceaccount.com roles/iam.workloadIdentityUser principalSet://iam.googleapis.com/projects/769327558062/locations/global/workloadIdentityPools/github-pool/attribute.repository/OtavioCollere/clinic-full-stack"
}

import {
  to = google_project_iam_member.github_deploy["roles/artifactregistry.writer"]
  id = "bianca-saas roles/artifactregistry.writer serviceAccount:github-deploy@bianca-saas.iam.gserviceaccount.com"
}

import {
  to = google_project_iam_member.github_deploy["roles/run.admin"]
  id = "bianca-saas roles/run.admin serviceAccount:github-deploy@bianca-saas.iam.gserviceaccount.com"
}

import {
  to = google_project_iam_member.github_deploy["roles/iam.serviceAccountUser"]
  id = "bianca-saas roles/iam.serviceAccountUser serviceAccount:github-deploy@bianca-saas.iam.gserviceaccount.com"
}

import {
  to = google_project_iam_member.github_deploy["roles/secretmanager.secretAccessor"]
  id = "bianca-saas roles/secretmanager.secretAccessor serviceAccount:github-deploy@bianca-saas.iam.gserviceaccount.com"
}

import {
  to = google_cloud_run_v2_service.api
  id = "projects/bianca-saas/locations/southamerica-east1/services/cliniker-api"
}

import {
  to = google_cloud_run_v2_service.frontend
  id = "projects/bianca-saas/locations/southamerica-east1/services/cliniker-frontend"
}

import {
  to = google_cloud_run_v2_service_iam_member.api_public
  id = "projects/bianca-saas/locations/southamerica-east1/services/cliniker-api roles/run.invoker allUsers"
}

import {
  to = google_cloud_run_v2_service_iam_member.frontend_public
  id = "projects/bianca-saas/locations/southamerica-east1/services/cliniker-frontend roles/run.invoker allUsers"
}
