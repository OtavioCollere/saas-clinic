# sass-clinic

# SaaS para Clínicas de Estética

## Visão Geral

**Produto:** SaaS para clínicas de estética de pequeno e médio porte.

**Objetivo:**  
Simplificar a operação da clínica (agenda, pacientes, procedimentos e pagamentos) e ajudar no aumento de faturamento e capacidade de atendimento.

---

## Perfis de Usuário

### Proprietário(a) / Gestor(a)
- Responsável pela configuração e gestão da clínica.
- Cria e gerencia unidades/franquias.
- Cria e gerencia profissionais.
- Cria e gerencia procedimentos.

### Profissionais / Funcionários(as)
- Ex.: médicos, biomédicos, recepção.
- Gerenciam pacientes.
- Criam, editam e cancelam agendamentos.
- Consultam procedimentos disponíveis.

### Clientes / Pacientes
- Agendam consultas.
- Preenchem e atualizam anamnese.
- Realizam pagamento de procedimentos.

---

## Módulos do Sistema (Escopo)

- **Autenticação e Perfis (RBAC)**
  - Controle de acesso por papel: `OWNER`, `STAFF`, `CLIENT`.

- **Clínica**
  - Entidade principal que representa a empresa.

- **Unidades / Franquias**
  - Múltiplas unidades por clínica.
  - Dados e operação separados por unidade.

- **Procedimentos**
  - Catálogo de procedimentos por unidade.
  - Preço e observações.

- **Agenda e Agendamentos**
  - Agendamento por profissional e unidade.
  - Controle de status.

- **Pacientes e Anamnese**
  - Cadastro de pacientes.
  - Questionário clínico (anamnese).

- **Pagamentos**
  - Integração com gateway de pagamento.
  - Pagamento antes ou após atendimento (a definir no MVP).

---

## Regras de Negócio (Decisões Iniciais)

- Um **Agendamento** pertence a:
  - uma **Unidade/Franquia**
  - um **Profissional**
- Um **Procedimento** é definido por **Unidade/Franquia**.
- Um **Paciente** pode ter:
  - múltiplas anamneses (histórico)
  - ou apenas a mais recente (a definir).
- Status de agendamento:
  - `waiting` → `confirmed` → `done`
  - `canceled`
- Pagamento pode ocorrer:
  - antes do atendimento (pré-pagamento)
  - após o atendimento

---

## Modelo de Dados (Entidades)

### User
Representa o acesso ao sistema.

- id
- name
- cpf
- email
- password_hash
- role (`OWNER`, `STAFF`, `CLIENT`)
- createdAt
- updatedAt

---

### Clinic
Representa a clínica (empresa).

- id
- name
- ownerId (User)
- createdAt
- updatedAt

---

### Franchise (Unidade)
Representa uma unidade física da clínica.

- id
- clinicId (Clinic)
- name
- address
- zipCode
- status
- description
- createdAt
- updatedAt

---

### Professional
Representa um profissional da clínica.

- id
- franchiseId (Franchise)
- userId (User)
- council (`CRM` ou `CRBM`)
- councilNumber
- councilState
- profession (`MEDICO`, `BIOMEDICO`)
- createdAt
- updatedAt

---

### Patient
Representa o paciente/cliente.

- id
- userId (opcional)
- name
- birthDay
- address
- zipCode
- createdAt
- updatedAt

---

### Anamnesis
Representa o questionário clínico do paciente.

- id
- patientId (Patient)
- hasDiabetes
- hasHipertensao
- createdAt
- updatedAt

---

### Procedure
Representa um procedimento oferecido pela clínica.

- id
- franchiseId (Franchise)
- name
- price
- notes
- status (`ACTIVE`, `INACTIVE`)
- createdAt
- updatedAt

---

### Appointment -> agreggate root
Representa um agendamento.

- id
- professionalId (Professional)
- franchiseId (Franchise)
- patientId (Patient)
- startAt (data/hora)
- endAt (data/hora)
- status (`waiting`, `confirmed`, `done`, `canceled`)
- createdAt
- updatedAt

---

### AppointmentItem
Representa os procedimentos vinculados ao agendamento.

- id
- appointmentId (Appointment)
- procedureId (Procedure)
- priceSnapshot (opcional)
- notes (opcional)

---

## Integrações (Rascunho)

### Pagamentos
- Integração com gateway de pagamento (ex.: Stripe, Mercado Pago).
- Uso de webhooks para confirmação.
- Status do pagamento vinculado ao agendamento.

---

## Casos de Uso

### User
- [ ] Criar usuário
- [ ] Editar usuário

---

### Clinic
- [ ] Criar clínica
- [ ] Editar clínica
- [ ] Inativar clínica
- [ ] Ativar clínica
- [ ] Buscar clínica por ID
- [ ] Listar clínicas com paginação e search query
- [ ] (Futuro) Transferir clínica para outra dona

---

### Franchise
- [ ] Criar franquia
  - [ ] Clínica deve existir
  - [ ] Apenas usuário com role `OWNER` pode criar (verificação no use case)
- [ ] Editar franquia
- [ ] Inativar franquia

---

### Patient
- [ ] Registrar paciente
  - [ ] User ID deve existir e ter role `CLIENT`
- [ ] Editar dados do paciente
- [ ] Buscar paciente por ID
- [ ] Listar pacientes com paginação e search query

---

### Professional
- [ ] Criar profissional
  - [ ] Apenas `OWNER` pode criar
  - [ ] Deve estar vinculado a uma franquia existente
  - [ ] Usuário associado deve existir
- [ ] Editar dados
  - [ ] O próprio usuário pode editar seus dados permitidos

---

### Procedure
- [ ] Criar procedimento
  - [ ] Procedimento não pode existir
  - [ ] Apenas a dona pode criar
- [ ] Editar procedimento
- [ ] Buscar procedimento por ID
- [ ] Listar procedimentos para clientes
- [ ] Listar procedimentos para profissionais
- [ ] Inativar procedimento

---

### Appointment
- [ ] Agendar consulta
  - [ ] patientId deve existir
  - [ ] professionalId deve existir
  - [ ] Agenda do profissional deve estar disponível
  - [ ] Intervalo mínimo de 5 minutos entre agendamentos
- [ ] Editar consulta
- [ ] Listar consultas por profissional
- [ ] Listar consultas por paciente

---

### AppointmentItem
- [ ] Criar item de agendamento
- [ ] Editar item de agendamento

---

### Anamnesis
- [ ] Criar anamnese
- [ ] Editar anamnese
- [ ] Buscar anamnese por userId

---

## Ordem de Implementação (Sugerida)

1. User
2. Clinic
3. Franchise
4. Patient
5. Professional
6. Procedure
7. Appointment
8. Anamnesis
