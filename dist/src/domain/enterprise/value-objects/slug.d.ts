export declare class Slug {
    private readonly value;
    private constructor();
    static create(text: string): Slug;
    getValue(): string;
    equals(other: Slug): boolean;
    toString(): string;
}
