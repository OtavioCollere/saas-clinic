import { Encrypter } from "@/domain/application/cryptography/encrypter";

export class FakeEncrypter implements Encrypter{
    sign(value: string): Promise<string> {
        return Promise.resolve('signed-token')
    }

    refresh(value: string): Promise<string> {
        return Promise.resolve('refresh-token')
    }

}