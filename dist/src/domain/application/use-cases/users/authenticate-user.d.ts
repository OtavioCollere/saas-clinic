import { Either } from "@/core/either/either";
import { WrongCredentialsError } from "@/core/errors/wrong-credentials-error";
import { UsersRepository } from "../../repositories/users-repository";
import { HashComparer } from "../../cryptography/hash-comparer";
import { Encrypter } from "../../cryptography/encrypter";
interface AuthenticateUserUseCaseRequest {
    email: string;
    password: string;
}
type AuthenticateUserUseCaseResponse = Either<WrongCredentialsError, {
    refresh_token: string;
    access_token: string;
}>;
export declare class AuthenticateUserUseCase {
    private usersRepository;
    private hashComparer;
    private encrypter;
    constructor(usersRepository: UsersRepository, hashComparer: HashComparer, encrypter: Encrypter);
    execute({ email, password }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse>;
}
export {};
