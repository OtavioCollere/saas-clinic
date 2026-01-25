import { Either, makeLeft, makeRight } from "@/core/either/either";
import { WrongCredentialsError } from "@/core/errors/wrong-credentials-error";
import { UsersRepository } from "../../repositories/users-repository";
import { HashComparer } from "../../cryptography/hash-comparer";
import { Encrypter } from "../../cryptography/encrypter";
import type { ClinicMembershipRepository } from "../../repositories/clinic-membership-repository";

interface AuthenticateUserUseCaseRequest{
    email: string;
    password: string;
}

type AuthenticateUserUseCaseResponse = Either<WrongCredentialsError,
{
    refresh_token: string;
    access_token: string;
}
>

export class AuthenticateUserUseCase{
    constructor(
        private usersRepository: UsersRepository,
        private hashComparer: HashComparer,
        private encrypter: Encrypter,
    ){}

    async execute({email, password}: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            return makeLeft(new WrongCredentialsError())
        }

        const doesPasswordMatches = await this.hashComparer.compare(password, user.password);

        if (!doesPasswordMatches) {
            return makeLeft(new WrongCredentialsError())
        }

        const accessToken = await this.encrypter.sign({
            userId : user.id.toString(),
        });
        
        const refreshToken = await this.encrypter.refresh({
            userId : user.id.toString(),
        });

        return makeRight({
            access_token : accessToken,
            refresh_token : refreshToken
        })
    }
}