import { type Either } from "@/core/either/either";
import { EmailAlreadyExistsError } from "@/core/errors/email-already-exists-error";
import { User } from "@/domain/enterprise/entities/user";
import type { HashGenerator } from "../../cryptography/hash-generator";
import type { UsersRepository } from "../../repositories/users-repository";
interface RegisterUserUseCaseRequest {
    name: string;
    cpf: string;
    email: string;
    password: string;
}
type RegisterUserUseCaseResponse = Either<EmailAlreadyExistsError, {
    user: User;
}>;
export declare class RegisterUserUseCase {
    private usersRepository;
    private hashGenerator;
    constructor(usersRepository: UsersRepository, hashGenerator: HashGenerator);
    execute({ name, cpf, email, password, }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse>;
}
export {};
