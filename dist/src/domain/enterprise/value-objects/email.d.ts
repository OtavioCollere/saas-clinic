export declare class Email {
    private readonly value;
    private constructor();
    static create(rawEmail: string): Email;
    getValue(): string;
    equals(email: Email): boolean;
    private static normalize;
    private static isValid;
}
