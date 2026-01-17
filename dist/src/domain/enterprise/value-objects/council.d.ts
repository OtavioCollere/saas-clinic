export type CouncilType = 'CRM' | 'CRBM';
export declare class Council {
    private readonly value;
    private constructor();
    static crm(): Council;
    static crbm(): Council;
    getValue(): CouncilType;
}
