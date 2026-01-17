export type FranchiseStatusType = 'ACTIVE' | 'INACTIVE';
export declare class FranchiseStatus {
    private readonly value;
    private constructor();
    static active(): FranchiseStatus;
    static inactive(): FranchiseStatus;
    isActive(): boolean;
    isInactive(): boolean;
    getValue(): FranchiseStatusType;
    activate(): FranchiseStatus;
    inactivate(): FranchiseStatus;
}
