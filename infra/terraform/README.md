# Infra do Cliniker (Terraform)

Estado atual da infra no GCP, projeto `bianca-saas` / regiao `southamerica-east1`.

## O que esta aqui

| Arquivo | Recursos |
| --- | --- |
| `run.tf` | Cloud Run `cliniker-api` e `cliniker-frontend` + acesso publico (`allUsers`) |
| `artifact_registry.tf` | Repositorio Docker `cliniker` (imagens `api` e `web`) |
| `cicd.tf` | SA `github-deploy`, Workload Identity pool/provider do GitHub, papeis do projeto |
| `imports.tf` | Blocos de import que adotam o que ja esta no ar; descartavel apos o primeiro apply |

## O que NAO esta aqui

- **Postgres e Redis** sao externos ao GCP (`DATABASE_URL`, `POOLER_HOST` e
  `UPSTASH_REDIS_REST_TOKEN` nos secrets do GitHub). Nao existe Cloud SQL no projeto.
- O pool `bianca-saas.svc.id.goog` e gerenciado pelo GKE, nao pelo Terraform.
- O frontend e buildado por outro repositorio (`OtavioCollere/clinic-full-stack`).

## Como rodar

O ADC da maquina pode estar apontando para outra conta, entao passe um token
explicito em vez de rodar `gcloud auth application-default login` (que sobrescreve
o ADC compartilhado com os outros projetos):

```bash
gcloud config configurations activate bianca
export GOOGLE_OAUTH_ACCESS_TOKEN=$(gcloud auth print-access-token --account=weebuildsoftware@gmail.com)

terraform -chdir=infra/terraform init
terraform -chdir=infra/terraform plan
```

O token vale ~1h; ao expirar, exporte de novo.

## Fronteira entre Terraform e CI

O `cd.yml` roda `gcloud run deploy` com `--env-vars-file`, ou seja **as env vars e
a tag da imagem sao definidas pelo CI**. Por isso os dois servicos tem:

```hcl
lifecycle {
  ignore_changes = [
    template[0].containers[0].image,
    template[0].containers[0].env,
    client,
    client_version,
  ]
}
```

Sem isso, um `terraform apply` apagaria as env vars do servico e faria rollback da
imagem para a tag fixada em `variables.tf`. As tags em `variables.tf` servem so
como referencia do que estava no ar quando o codigo foi escrito.

Para o Terraform passar a ser dono das env vars tambem, o caminho e mover os
valores para o Secret Manager (a SA de deploy ja tem `secretmanager.secretAccessor`),
declarar `env { value_source { secret_key_ref } }` aqui, remover o
`--env-vars-file` do `cd.yml` e tirar `env` do `ignore_changes`.

## State

Backend local (`terraform.tfstate`, ignorado pelo git). Depois do import o state
contem os valores das env vars dos servicos em texto puro, incluindo `DATABASE_URL`
e `JWT_PRIVATE_KEY`. Antes de mover o state para um bucket GCS, restrinja o acesso
ao bucket ou migre as env vars para o Secret Manager.
