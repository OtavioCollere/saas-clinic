export abstract class Encrypter {
    abstract sign(payload: Record<string, unknown>): Promise<string>
    abstract refresh(payload: Record<string, unknown>): Promise<string>
}