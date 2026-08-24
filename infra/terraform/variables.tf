variable "project_id" {
  description = "Projeto GCP que hospeda o Cliniker."
  type        = string
  default     = "bianca-saas"
}

variable "project_number" {
  description = "Numero do projeto, usado no principalSet do Workload Identity."
  type        = string
  default     = "769327558062"
}

variable "region" {
  description = "Regiao do Cloud Run e do Artifact Registry."
  type        = string
  default     = "southamerica-east1"
}

variable "github_owner" {
  description = "Owner dos repositorios autorizados a assumir a SA de deploy."
  type        = string
  default     = "OtavioCollere"
}

variable "github_repos" {
  description = "Repositorios que podem assumir a SA de deploy via Workload Identity."
  type        = list(string)
  default = [
    "OtavioCollere/saas-clinic",
    "OtavioCollere/clinic-full-stack",
  ]
}

variable "api_image_tag" {
  description = "Tag da imagem da API. O CI sobrescreve a cada deploy; o Terraform ignora."
  type        = string
  default     = "457ed1f7fa42e3923337886552f05edc456fa332"
}

variable "web_image_tag" {
  description = "Tag da imagem do frontend. O CI sobrescreve a cada deploy; o Terraform ignora."
  type        = string
  default     = "8f15cde086a56d4ad11b761e6e2206d2be60ed52"
}
