import { Encrypter } from "@/domain/application/cryptography/encrypter";

export class FakeEncrypter implements Encrypter{
    sign(value: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    
    refresh(value: string): Promise<string> {
        throw new Error("Method not implemented.");
    }

}