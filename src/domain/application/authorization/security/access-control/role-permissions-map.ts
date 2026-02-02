import { ClinicPermissions } from "./permission";

export const CLINIC_ROLE_PERMISSIONS = {

    OWNER : Object.values(ClinicPermissions),

    ADMIN : [
        ClinicPermissions.CREATE_CLINIC,
        ClinicPermissions.UPDATE_CLINIC,
        ClinicPermissions.DELETE_CLINIC,
        ClinicPermissions.VIEW_CLINIC,
        ClinicPermissions.MANAGE_CLINIC_MEMBERS,
        ClinicPermissions.MANAGE_CLINIC_PROFESSIONALS,
        ClinicPermissions.MANAGE_CLINIC_PATIENTS,
        ClinicPermissions.MANAGE_CLINIC_APPOINTMENTS,
        ClinicPermissions.MANAGE_CLINIC_INVOICES,
        ClinicPermissions.MANAGE_CLINIC_REPORTS,
        ClinicPermissions.MANAGE_CLINIC_SETTINGS,
    ],

    PROFESSIONAL : [
        ClinicPermissions.CREATE_APPOINTMENT,
        ClinicPermissions.UPDATE_APPOINTMENT,
        ClinicPermissions.CANCEL_APPOINTMENT,
        ClinicPermissions.CONFIRM_APPOINTMENT,
        ClinicPermissions.VIEW_APPOINTMENT,
        ClinicPermissions.VIEW_APPOINTMENTS,
        ClinicPermissions.VIEW_APPOINTMENTS_BY_PROFESSIONAL,
        ClinicPermissions.VIEW_APPOINTMENTS_BY_PATIENT,
    ],

    PATIENT : [
        ClinicPermissions.VIEW_PATIENT,
        ClinicPermissions.VIEW_PATIENTS,
        ClinicPermissions.VIEW_PATIENTS_BY_PROFESSIONAL,
    ],
}

