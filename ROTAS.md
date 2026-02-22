# Rotas da Aplicação - SaaS Clinic

Este documento lista todas as rotas HTTP disponíveis na aplicação, organizadas por domínio.

**Base URL:** `http://localhost:3000`

**Documentação Swagger:** `http://localhost:3000/api`

---

## Health Check

### GET /health
Verifica o status geral de saúde da aplicação.

**URL Completa:** `http://localhost:3000/health`

### GET /health/database
Verifica especificamente a saúde da conexão com o banco de dados.

**URL Completa:** `http://localhost:3000/health/database`

### GET /health/ready
Verifica se a aplicação está pronta para receber requisições.

**URL Completa:** `http://localhost:3000/health/ready`

---

## Usuários (Users)

### POST /users/register-user
Registra um novo usuário no sistema.

**URL Completa:** `http://localhost:3000/users/register-user`

### POST /users/authenticate
Autentica um usuário e retorna tokens de acesso ou desafio MFA.

**URL Completa:** `http://localhost:3000/users/authenticate`

### POST /users/logout
Faz logout do usuário autenticado e revoga todas as sessões ativas.

**URL Completa:** `http://localhost:3000/users/logout`

---

## Multi-Factor Authentication (MFA)

### POST /mfa/setup
Configura o Multi-Factor Authentication para o usuário autenticado.

**URL Completa:** `http://localhost:3000/mfa/setup`

### POST /mfa/enable
Ativa o Multi-Factor Authentication para o usuário autenticado.

**URL Completa:** `http://localhost:3000/mfa/enable`

### POST /mfa/verify-login
Verifica o código TOTP e completa a autenticação MFA.

**URL Completa:** `http://localhost:3000/mfa/verify-login`

---

## Verificação de Email

### POST /email-verification/send-email-verification
Envia email de verificação para o usuário.

**URL Completa:** `http://localhost:3000/email-verification/send-email-verification`

---

## Clínicas (Clinics)

### POST /clinics
Cria uma nova clínica.

**URL Completa:** `http://localhost:3000/clinics`

### GET /clinics
Lista todas as clínicas.

**URL Completa:** `http://localhost:3000/clinics`

### GET /clinics/:clinicId
Busca uma clínica específica por ID.

**URL Completa:** `http://localhost:3000/clinics/:clinicId`

### PATCH /clinics/:clinicId
Edita uma clínica existente.

**URL Completa:** `http://localhost:3000/clinics/:clinicId`

### PATCH /clinics/:clinicId/activate
Ativa uma clínica.

**URL Completa:** `http://localhost:3000/clinics/:clinicId/activate`

### PATCH /clinics/:clinicId/inactivate
Desativa uma clínica.

**URL Completa:** `http://localhost:3000/clinics/:clinicId/inactivate`

---

## Franquias (Franchises)

### POST /clinics/:clinicId/franchises
Registra uma nova franquia para uma clínica.

**URL Completa:** `http://localhost:3000/clinics/:clinicId/franchises`

### GET /clinics/:clinicId/franchises
Lista todas as franquias de uma clínica.

**URL Completa:** `http://localhost:3000/clinics/:clinicId/franchises`

### PATCH /franchises/:franchiseId
Edita uma franquia existente.

**URL Completa:** `http://localhost:3000/franchises/:franchiseId`

### PATCH /franchises/:franchiseId/activate
Ativa uma franquia.

**URL Completa:** `http://localhost:3000/franchises/:franchiseId/activate`

### PATCH /franchises/:franchiseId/inactivate
Desativa uma franquia.

**URL Completa:** `http://localhost:3000/franchises/:franchiseId/inactivate`

---

## Pacientes (Patients)

### POST /clinics/:clinicId/patients
Registra um novo paciente em uma clínica.

**URL Completa:** `http://localhost:3000/clinics/:clinicId/patients`

### GET /patients
Lista todos os pacientes.

**URL Completa:** `http://localhost:3000/patients`

### GET /patients/:patientId
Busca um paciente específico por ID.

**URL Completa:** `http://localhost:3000/patients/:patientId`

### PATCH /patients/:patientId
Edita um paciente existente.

**URL Completa:** `http://localhost:3000/patients/:patientId`

---

## Profissionais (Professionals)

### POST /franchises/:franchiseId/professionals
Cria um novo profissional em uma franquia.

**URL Completa:** `http://localhost:3000/franchises/:franchiseId/professionals`

### GET /franchises/:franchiseId/professionals
Lista todos os profissionais de uma franquia.

**URL Completa:** `http://localhost:3000/franchises/:franchiseId/professionals`

### GET /professionals/:professionalId
Busca um profissional específico por ID.

**URL Completa:** `http://localhost:3000/professionals/:professionalId`

### PATCH /professionals/:professionalId
Edita um profissional existente.

**URL Completa:** `http://localhost:3000/professionals/:professionalId`

---

## Procedimentos (Procedures)

### POST /procedures
Cria um novo procedimento.

**URL Completa:** `http://localhost:3000/procedures`

### GET /franchises/:franchiseId/procedures
Lista todos os procedimentos de uma franquia.

**URL Completa:** `http://localhost:3000/franchises/:franchiseId/procedures`

### GET /procedures/:procedureId
Busca um procedimento específico por ID.

**URL Completa:** `http://localhost:3000/procedures/:procedureId`

### PATCH /procedures/:procedureId
Edita um procedimento existente.

**URL Completa:** `http://localhost:3000/procedures/:procedureId`

### PATCH /procedures/:procedureId/inactivate
Desativa um procedimento.

**URL Completa:** `http://localhost:3000/procedures/:procedureId/inactivate`

---

## Agendamentos (Appointments)

### POST /appointments
Cria um novo agendamento.

**URL Completa:** `http://localhost:3000/appointments`

### GET /patients/:patientId/appointments
Lista todos os agendamentos de um paciente.

**URL Completa:** `http://localhost:3000/patients/:patientId/appointments`

### PATCH /appointments/:appointmentId/confirm
Confirma um agendamento.

**URL Completa:** `http://localhost:3000/appointments/:appointmentId/confirm`

### PATCH /appointments/:appointmentId/cancel
Cancela um agendamento.

**URL Completa:** `http://localhost:3000/appointments/:appointmentId/cancel`

---

## Anamneses

### POST /patients/:patientId/anamnesis
Cria uma nova anamnese para um paciente.

**URL Completa:** `http://localhost:3000/patients/:patientId/anamnesis`

### GET /patients/:patientId/anamnesis
Busca a anamnese de um paciente específico.

**URL Completa:** `http://localhost:3000/patients/:patientId/anamnesis`

---

## Resumo por Domínio

### Health Check
- GET /health
- GET /health/database
- GET /health/ready

### Usuários
- POST /users/register-user
- POST /users/authenticate
- POST /users/logout

### MFA
- POST /mfa/setup
- POST /mfa/enable
- POST /mfa/verify-login

### Verificação de Email
- POST /email-verification/send-email-verification

### Clínicas
- POST /clinics
- GET /clinics
- GET /clinics/:clinicId
- PATCH /clinics/:clinicId
- PATCH /clinics/:clinicId/activate
- PATCH /clinics/:clinicId/inactivate

### Franquias
- POST /clinics/:clinicId/franchises
- GET /clinics/:clinicId/franchises
- PATCH /franchises/:franchiseId
- PATCH /franchises/:franchiseId/activate
- PATCH /franchises/:franchiseId/inactivate

### Pacientes
- POST /clinics/:clinicId/patients
- GET /patients
- GET /patients/:patientId
- PATCH /patients/:patientId

### Profissionais
- POST /franchises/:franchiseId/professionals
- GET /franchises/:franchiseId/professionals
- GET /professionals/:professionalId
- PATCH /professionals/:professionalId

### Procedimentos
- POST /procedures
- GET /franchises/:franchiseId/procedures
- GET /procedures/:procedureId
- PATCH /procedures/:procedureId
- PATCH /procedures/:procedureId/inactivate

### Agendamentos
- POST /appointments
- GET /patients/:patientId/appointments
- PATCH /appointments/:appointmentId/confirm
- PATCH /appointments/:appointmentId/cancel

### Anamneses
- POST /patients/:patientId/anamnesis
- GET /patients/:patientId/anamnesis

---

## Notas

- Todas as rotas, exceto as marcadas como públicas (health check, registro, autenticação), requerem autenticação via JWT.
- Os parâmetros de rota (como `:clinicId`, `:patientId`, etc.) devem ser substituídos pelos valores reais nas requisições.
- A documentação completa da API está disponível em `http://localhost:3000/api` via Swagger/OpenAPI.

