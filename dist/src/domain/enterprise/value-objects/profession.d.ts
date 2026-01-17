export type ProfessionType = 'MEDICO' | 'BIOMEDICO';
export declare class Profession {
    private readonly value;
    private constructor();
    static medico(): Profession;
    static biomedico(): Profession;
    isMedico(): boolean;
    isBiomedico(): boolean;
    getValue(): ProfessionType;
}
