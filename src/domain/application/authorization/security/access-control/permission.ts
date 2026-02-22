export enum ClinicPermissions {
    // Clinic Management
    CREATE_CLINIC = 'create.clinic',
    UPDATE_CLINIC = 'update.clinic',
    DELETE_CLINIC = 'delete.clinic',
    VIEW_CLINIC = 'view.clinic',
    FETCH_CLINICS = 'fetch.clinics',
    GET_CLINIC_BY_ID = 'get.clinic.by.id',
    ACTIVATE_CLINIC = 'activate.clinic',
    INACTIVATE_CLINIC = 'inactivate.clinic',
    MANAGE_CLINIC_MEMBERS = 'manage.clinic.members',
    MANAGE_CLINIC_PROFESSIONALS = 'manage.clinic.professionals',
    MANAGE_CLINIC_PATIENTS = 'manage.clinic.patients',
    MANAGE_CLINIC_APPOINTMENTS = 'manage.clinic.appointments',
    MANAGE_CLINIC_INVOICES = 'manage.clinic.invoices',
    MANAGE_CLINIC_REPORTS = 'manage.clinic.reports',
    MANAGE_CLINIC_SETTINGS = 'manage.clinic.settings',
    GET_CLINIC_USERS = 'get.clinic.users',

    // Franchise Management
    CREATE_FRANCHISE = 'create.franchise',
    UPDATE_FRANCHISE = 'update.franchise',
    DELETE_FRANCHISE = 'delete.franchise',
    VIEW_FRANCHISE = 'view.franchise',
    FETCH_FRANCHISES = 'fetch.franchises',
    FETCH_FRANCHISES_BY_CLINIC = 'fetch.franchises.by.clinic',
    ACTIVATE_FRANCHISE = 'activate.franchise',
    INACTIVATE_FRANCHISE = 'inactivate.franchise',

    // Professional Management
    CREATE_PROFESSIONAL = 'create.professional',
    UPDATE_PROFESSIONAL = 'update.professional',
    DELETE_PROFESSIONAL = 'delete.professional',
    VIEW_PROFESSIONAL = 'view.professional',
    GET_PROFESSIONAL_BY_ID = 'get.professional.by.id',
    FETCH_PROFESSIONALS = 'fetch.professionals',
    FETCH_PROFESSIONALS_BY_CLINIC = 'fetch.professionals.by.clinic',
    FETCH_PROFESSIONALS_BY_FRANCHISE = 'fetch.professionals.by.franchise',

    // Patient Management
    CREATE_PATIENT = 'create.patient',
    UPDATE_PATIENT = 'update.patient',
    DELETE_PATIENT = 'delete.patient',
    VIEW_PATIENT = 'view.patient',
    VIEW_PATIENTS = 'view.patients',
    GET_PATIENT_BY_ID = 'get.patient.by.id',
    FETCH_PATIENTS = 'fetch.patients',
    FETCH_PATIENTS_BY_CLINIC = 'fetch.patients.by.clinic',
    VIEW_PATIENTS_BY_PROFESSIONAL = 'view.patients.by.professional',

    // Procedure Management
    CREATE_PROCEDURE = 'create.procedure',
    UPDATE_PROCEDURE = 'update.procedure',
    DELETE_PROCEDURE = 'delete.procedure',
    VIEW_PROCEDURE = 'view.procedure',
    GET_PROCEDURE_BY_ID = 'get.procedure.by.id',
    FETCH_PROCEDURES = 'fetch.procedures',
    FETCH_PROCEDURES_BY_CLINIC = 'fetch.procedures.by.clinic',
    FETCH_PROCEDURES_BY_FRANCHISE = 'fetch.procedures.by.franchise',
    INACTIVATE_PROCEDURE = 'inactivate.procedure',

    // Appointment Management
    CREATE_APPOINTMENT = 'create.appointment',
    UPDATE_APPOINTMENT = 'update.appointment',
    CANCEL_APPOINTMENT = 'cancel.appointment',
    CONFIRM_APPOINTMENT = 'confirm.appointment',
    VIEW_APPOINTMENT = 'view.appointment',
    VIEW_APPOINTMENTS = 'view.appointments',
    GET_APPOINTMENT_BY_ID = 'get.appointment.by.id',
    FETCH_APPOINTMENTS_BY_CLINIC = 'fetch.appointments.by.clinic',
    FETCH_APPOINTMENTS_BY_CLINIC_WEEK = 'fetch.appointments.by.clinic.week',
    VIEW_APPOINTMENTS_BY_PROFESSIONAL = 'view.appointments.by.professional',
    VIEW_APPOINTMENTS_BY_PATIENT = 'view.appointments.by.patient',

    // Anamnesis Management
    CREATE_ANAMNESIS = 'create.anamnesis',
    VIEW_ANAMNESIS = 'view.anamnesis',
    GET_ANAMNESIS_BY_PATIENT = 'get.anamnesis.by.patient'
}

