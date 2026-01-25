import { HashComparer } from "@/domain/application/cryptography/hash-comparer";
import { HashGenerator } from "@/domain/application/cryptography/hash-generator";
import { Injectable } from "@nestjs/common";
import bcrypt from "bcryptjs";

@Injectable()
export class BcryptHasher implements HashGenerator, HashComparer{
    async hash(value: string): Promise<string> {
        return bcrypt.hash(value, 8);
    }

    async compare(plainText: string, hashedText: string): Promise<Boolean> {
        return bcrypt.compare(plainText, hashedText);
    }
}