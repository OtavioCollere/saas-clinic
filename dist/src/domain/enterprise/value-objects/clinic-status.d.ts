export type ClinicStatusType = 'ACTIVE' | 'INACTIVE';
export declare class ClinicStatus {
    private readonly value;
    private constructor();
    static active(): ClinicStatus;
    static inactive(): ClinicStatus;
    isActive(): boolean;
    isInactive(): boolean;
    getValue(): ClinicStatusType;
    activate(): ClinicStatus;
    inactivate(): ClinicStatus;
}
