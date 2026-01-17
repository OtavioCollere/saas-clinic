export type ProcedureStatusType = 'ACTIVE' | 'INACTIVE';
export declare class ProcedureStatus {
    private readonly value;
    private constructor();
    static active(): ProcedureStatus;
    static inactive(): ProcedureStatus;
    isActive(): boolean;
    isInactive(): boolean;
    getValue(): ProcedureStatusType;
}
