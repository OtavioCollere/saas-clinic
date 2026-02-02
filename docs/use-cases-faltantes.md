# Use Cases Faltantes

## 🔐 Módulo Users
- [ ] logout

## 📧 Módulo Email Verification
- [x] send-email-verification
- [x] verify-email

## 🏥 Módulo Clinic
- [x] create-clinic
- [x] edit-clinic
- [x] activate-clinic
- [x] inactivate-clinic
- [x] get-clinic-by-id
- [x] fetch-clinic

## 🏢 Módulo Franchise
- [x] register-franchise
- [x] edit-franchise
- [x] activate-franchise
- [x] inactivate-franchise
- [x] fetch-franchises-by-clinic-id

## 👤 Módulo Patient
- [x] register-patient
- [x] edit-patient
- [x] get-patient-by-id
- [x] fetch-patients

## 👨‍⚕️ Módulo Professional
- [x] create-professional
- [x] edit-professional
- [x] get-professional
- [x] get-professionals-by-franchise-id

## 📅 Módulo Appointment
Regras de negocio :
    - So pode cancelar um appointennt que esta no status de espera (nao lembro o nome)
    - Appointment nao pode ser apagado do banco, apenas fica com status cancelled
    - confirm appointment
        - feito pelo paciente
        - paciente tem que existir

- [x] create-appointment
- [x] edit-appointment
- [x] fetch-appointments-by-professional-id
- [x] fetch-appointments-by-patient-id
- [x] cancel-appointment
- [x] confirm-appointment

## 🔬 Módulo Procedure
Regras de negocio :
    - franquia tem que existir

- [x] create-procedure
- [x] edit-procedure
- [x] get-procedure-by-id
- [x] fetch-procedures-by-franchise-id
- [x] inactivate-procedure

## 📋 Módulo Anamnesis
Regra- paciente tem que existir
- [x] create-anamnesis
- [x] get-anamnesis-by-patient-id
