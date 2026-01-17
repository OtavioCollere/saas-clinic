export declare class Cpf {
    private readonly value;
    private constructor();
    static create(rawCpf: string): Cpf;
    getValue(): string;
    equals(cpf: Cpf): boolean;
    private static normalize;
    private static isValid;
}
