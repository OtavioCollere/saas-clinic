import { Encrypter } from "@/domain/application/cryptography/encrypter";

export class FakeEncrypter implements Encrypter{
    sign(payload: Record<string, unknown>): Promise<string> {
        return Promise.resolve('signed-token')
    }

    refresh(payload: Record<string, unknown>): Promise<string> {
        return Promise.resolve('refresh-token')
    }

}