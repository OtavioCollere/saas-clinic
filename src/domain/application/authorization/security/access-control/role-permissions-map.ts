import { ClinicPermissions } from "./permission";

export const CLINIC_ROLE_PERMISSIONS = {

    OWNER : Object.values(ClinicPermissions),

    ADMIN : [
        // Clinic Management
        ClinicPermissions.CREATE_CLINIC,
        ClinicPermissions.UPDATE_CLINIC,
        ClinicPermissions.DELETE_CLINIC,
        ClinicPermissions.VIEW_CLINIC,
        ClinicPermissions.FETCH_CLINICS,
        ClinicPermissions.GET_CLINIC_BY_ID,
        ClinicPermissions.ACTIVATE_CLINIC,
        ClinicPermissions.INACTIVATE_CLINIC,
        ClinicPermissions.MANAGE_CLINIC_MEMBERS,
        ClinicPermissions.MANAGE_CLINIC_PROFESSIONALS,
        ClinicPermissions.MANAGE_CLINIC_PATIENTS,
        ClinicPermissions.MANAGE_CLINIC_APPOINTMENTS,
        ClinicPermissions.MANAGE_CLINIC_INVOICES,
        ClinicPermissions.MANAGE_CLINIC_REPORTS,
        ClinicPermissions.MANAGE_CLINIC_SETTINGS,
        ClinicPermissions.GET_CLINIC_USERS,

        // Franchise Management
        ClinicPermissions.CREATE_FRANCHISE,
        ClinicPermissions.UPDATE_FRANCHISE,
        ClinicPermissions.DELETE_FRANCHISE,
        ClinicPermissions.VIEW_FRANCHISE,
        ClinicPermissions.FETCH_FRANCHISES,
        ClinicPermissions.FETCH_FRANCHISES_BY_CLINIC,
        ClinicPermissions.ACTIVATE_FRANCHISE,
        ClinicPermissions.INACTIVATE_FRANCHISE,

        // Professional Management
        ClinicPermissions.CREATE_PROFESSIONAL,
        ClinicPermissions.UPDATE_PROFESSIONAL,
        ClinicPermissions.DELETE_PROFESSIONAL,
        ClinicPermissions.VIEW_PROFESSIONAL,
        ClinicPermissions.GET_PROFESSIONAL_BY_ID,
        ClinicPermissions.FETCH_PROFESSIONALS,
        ClinicPermissions.FETCH_PROFESSIONALS_BY_CLINIC,
        ClinicPermissions.FETCH_PROFESSIONALS_BY_FRANCHISE,

        // Patient Management
        ClinicPermissions.CREATE_PATIENT,
        ClinicPermissions.UPDATE_PATIENT,
        ClinicPermissions.DELETE_PATIENT,
        ClinicPermissions.VIEW_PATIENT,
        ClinicPermissions.VIEW_PATIENTS,
        ClinicPermissions.GET_PATIENT_BY_ID,
        ClinicPermissions.FETCH_PATIENTS,
        ClinicPermissions.FETCH_PATIENTS_BY_CLINIC,
        ClinicPermissions.VIEW_PATIENTS_BY_PROFESSIONAL,

        // Procedure Management
        ClinicPermissions.CREATE_PROCEDURE,
        ClinicPermissions.UPDATE_PROCEDURE,
        ClinicPermissions.DELETE_PROCEDURE,
        ClinicPermissions.VIEW_PROCEDURE,
        ClinicPermissions.GET_PROCEDURE_BY_ID,
        ClinicPermissions.FETCH_PROCEDURES,
        ClinicPermissions.FETCH_PROCEDURES_BY_CLINIC,
        ClinicPermissions.FETCH_PROCEDURES_BY_FRANCHISE,
        ClinicPermissions.INACTIVATE_PROCEDURE,

        // Appointment Management
        ClinicPermissions.CREATE_APPOINTMENT,
        ClinicPermissions.UPDATE_APPOINTMENT,
        ClinicPermissions.CANCEL_APPOINTMENT,
        ClinicPermissions.CONFIRM_APPOINTMENT,
        ClinicPermissions.VIEW_APPOINTMENT,
        ClinicPermissions.VIEW_APPOINTMENTS,
        ClinicPermissions.GET_APPOINTMENT_BY_ID,
        ClinicPermissions.FETCH_APPOINTMENTS_BY_CLINIC,
        ClinicPermissions.FETCH_APPOINTMENTS_BY_CLINIC_WEEK,
        ClinicPermissions.VIEW_APPOINTMENTS_BY_PROFESSIONAL,
        ClinicPermissions.VIEW_APPOINTMENTS_BY_PATIENT,

        // Anamnesis Management
        ClinicPermissions.CREATE_ANAMNESIS,
        ClinicPermissions.VIEW_ANAMNESIS,
        ClinicPermissions.GET_ANAMNESIS_BY_PATIENT,
    ],

    PROFESSIONAL : [
        // Professional - can view own profile
        ClinicPermissions.VIEW_PROFESSIONAL,
        ClinicPermissions.GET_PROFESSIONAL_BY_ID,
        ClinicPermissions.UPDATE_PROFESSIONAL, // Can update own profile

        // Professional - can view patients
        ClinicPermissions.VIEW_PATIENT,
        ClinicPermissions.VIEW_PATIENTS,
        ClinicPermissions.GET_PATIENT_BY_ID,
        ClinicPermissions.VIEW_PATIENTS_BY_PROFESSIONAL,

        // Professional - can manage appointments
        ClinicPermissions.CREATE_APPOINTMENT,
        ClinicPermissions.UPDATE_APPOINTMENT,
        ClinicPermissions.CANCEL_APPOINTMENT,
        ClinicPermissions.CONFIRM_APPOINTMENT,
        ClinicPermissions.VIEW_APPOINTMENT,
        ClinicPermissions.VIEW_APPOINTMENTS,
        ClinicPermissions.GET_APPOINTMENT_BY_ID,
        ClinicPermissions.VIEW_APPOINTMENTS_BY_PROFESSIONAL,
        ClinicPermissions.VIEW_APPOINTMENTS_BY_PATIENT,

        // Professional - can view procedures
        ClinicPermissions.VIEW_PROCEDURE,
        ClinicPermissions.GET_PROCEDURE_BY_ID,
        ClinicPermissions.FETCH_PROCEDURES,
        ClinicPermissions.FETCH_PROCEDURES_BY_FRANCHISE,

        // Professional - can view and create anamnesis
        ClinicPermissions.CREATE_ANAMNESIS,
        ClinicPermissions.VIEW_ANAMNESIS,
        ClinicPermissions.GET_ANAMNESIS_BY_PATIENT,
    ],

    COLLABORATOR : [
        // Clinic
        ClinicPermissions.VIEW_CLINIC,
        ClinicPermissions.GET_CLINIC_BY_ID,
        ClinicPermissions.GET_CLINIC_USERS,

        // Patients
        ClinicPermissions.CREATE_PATIENT,
        ClinicPermissions.UPDATE_PATIENT,
        ClinicPermissions.VIEW_PATIENT,
        ClinicPermissions.VIEW_PATIENTS,
        ClinicPermissions.GET_PATIENT_BY_ID,
        ClinicPermissions.FETCH_PATIENTS,
        ClinicPermissions.FETCH_PATIENTS_BY_CLINIC,

        // Appointments
        ClinicPermissions.CREATE_APPOINTMENT,
        ClinicPermissions.UPDATE_APPOINTMENT,
        ClinicPermissions.CANCEL_APPOINTMENT,
        ClinicPermissions.CONFIRM_APPOINTMENT,
        ClinicPermissions.VIEW_APPOINTMENT,
        ClinicPermissions.VIEW_APPOINTMENTS,
        ClinicPermissions.GET_APPOINTMENT_BY_ID,
        ClinicPermissions.FETCH_APPOINTMENTS_BY_CLINIC,
        ClinicPermissions.FETCH_APPOINTMENTS_BY_CLINIC_WEEK,
        ClinicPermissions.VIEW_APPOINTMENTS_BY_PROFESSIONAL,
        ClinicPermissions.VIEW_APPOINTMENTS_BY_PATIENT,

        // Procedures (read-only)
        ClinicPermissions.VIEW_PROCEDURE,
        ClinicPermissions.GET_PROCEDURE_BY_ID,
        ClinicPermissions.FETCH_PROCEDURES,
        ClinicPermissions.FETCH_PROCEDURES_BY_CLINIC,
        ClinicPermissions.FETCH_PROCEDURES_BY_FRANCHISE,

        // Professionals (read-only — para criar consulta)
        ClinicPermissions.VIEW_PROFESSIONAL,
        ClinicPermissions.GET_PROFESSIONAL_BY_ID,
        ClinicPermissions.FETCH_PROFESSIONALS,
        ClinicPermissions.FETCH_PROFESSIONALS_BY_CLINIC,
        ClinicPermissions.FETCH_PROFESSIONALS_BY_FRANCHISE,

        // Anamnesis
        ClinicPermissions.VIEW_ANAMNESIS,
        ClinicPermissions.GET_ANAMNESIS_BY_PATIENT,
    ],

    PATIENT : [
        // Patient - can view own profile
        ClinicPermissions.VIEW_PATIENT,
        ClinicPermissions.GET_PATIENT_BY_ID,
        ClinicPermissions.UPDATE_PATIENT, // Can update own profile

        // Patient - can view own appointments
        ClinicPermissions.VIEW_APPOINTMENT,
        ClinicPermissions.VIEW_APPOINTMENTS,
        ClinicPermissions.GET_APPOINTMENT_BY_ID,
        ClinicPermissions.VIEW_APPOINTMENTS_BY_PATIENT,

        // Patient - can view own anamnesis
        ClinicPermissions.VIEW_ANAMNESIS,
        ClinicPermissions.GET_ANAMNESIS_BY_PATIENT,
    ],
}

