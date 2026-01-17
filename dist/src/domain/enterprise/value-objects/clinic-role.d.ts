export type ClinicRoleType = 'ADMIN' | 'OWNER' | 'PROFESSIONAL' | 'PATIENT';
export declare class ClinicRole {
    private readonly value;
    constructor(value: ClinicRoleType);
    static owner(): ClinicRole;
    static admin(): ClinicRole;
    static professional(): ClinicRole;
    static patient(): ClinicRole;
    isOwner(): boolean;
    isAdmin(): boolean;
    isProfessional(): boolean;
    isPatient(): boolean;
    getValue(): ClinicRoleType;
}
