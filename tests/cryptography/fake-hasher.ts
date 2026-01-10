import { HashComparer } from "@/domain/application/cryptography/hash-comparer";
import { HashGenerator } from "@/domain/application/cryptography/hash-generator";

export class FakeHasher implements HashGenerator, HashComparer{
    hash(value: string): string {
        return value.concat('-hashed')
    }

    compare(plainText: string, hashedText: string) {
        return plainText.concat('-hashed') === hashedText
    }
}