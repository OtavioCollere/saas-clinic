export interface Encrypter {
    sign(value: string): Promise<string>;
    refresh(value: string): Promise<string>;
}
