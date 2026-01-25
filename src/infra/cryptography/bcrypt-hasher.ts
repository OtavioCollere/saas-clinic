import { HashComparer } from "@/domain/application/cryptography/hash-comparer";
import { HashGenerator } from "@/domain/application/cryptography/hash-generator";

export class BcryptHasher implements HashGenerator, HashComparer{
    hash(value: string): string {
        return bcrypt
    }

    compare(plainText: string, hashedText: string): Boolean {
        
    }
    
}