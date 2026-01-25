import { Module } from "@nestjs/common";
import { BcryptHasher } from "./bcrypt-hasher";
import { HashGenerator } from "@/domain/application/cryptography/hash-generator";
import { JwtEncrypter } from "./jwt-encrypter";
import { HashComparer } from "@/domain/application/cryptography/hash-comparer";
import { Encrypter } from "@/domain/application/cryptography/encrypter";

@Module({
  providers : [
    {provide : HashGenerator, useClass : BcryptHasher},
    {provide : HashComparer, useClass : BcryptHasher},
    {provide : Encrypter, useClass : JwtEncrypter},
  ],
  exports : [
    BcryptHasher,
    JwtEncrypter,
  ]
})
export class CryptographyModule {}