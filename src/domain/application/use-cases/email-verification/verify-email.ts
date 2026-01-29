import { Inject, Injectable } from "@nestjs/common";
import { Either, makeLeft, makeRight } from "@/core/either/either";
import { EmailVerificationRepository } from "../../repositories/email-verification-repository";
import { UsersRepository } from "../../repositories/users-repository";
import { UserNotFoundError } from "@/core/errors/user-not-found-error";
import { EmailVerificationNotFoundError } from "@/core/errors/email-verification-not-found-error";
import { InvalidTokenEmailVerificationError } from "@/core/errors/token-email-verification-expired-error";
import { TokenAlreadyUsedEmailVerificationError } from "@/core/errors/token-already-used-email-verification-error";

interface VerifyEmailUseCaseRequest {
    token: string;
}

type VerifyEmailUseCaseResponse = Either<
    EmailVerificationNotFoundError | UserNotFoundError | InvalidTokenEmailVerificationError | TokenAlreadyUsedEmailVerificationError,
    {
        
    }
>

@Injectable()
export class VerifyEmailUseCase {
    constructor(
        @Inject(UsersRepository)
        private usersRepository: UsersRepository,
        @Inject(EmailVerificationRepository)
        private emailVerificationRepository: EmailVerificationRepository
    ){}

    async execute({token}: VerifyEmailUseCaseRequest) : Promise<VerifyEmailUseCaseResponse> {
        const emailVerification = await this.emailVerificationRepository.findByToken(token);

        if (!emailVerification) {
            return makeLeft(new EmailVerificationNotFoundError());
        }

        const user = await this.usersRepository.findByEmail(emailVerification.email.getValue());

        if (!user) {
            return makeLeft(new UserNotFoundError());
        }

        const isTokenExpired = emailVerification.expiresAt < new Date();

        if (isTokenExpired) {
            return makeLeft(new InvalidTokenEmailVerificationError());
        }

        const isTokenUsed = emailVerification.verifiedAt !== null;

        if (isTokenUsed) {
            return makeLeft(new TokenAlreadyUsedEmailVerificationError());
        }

        user.verifyEmail();
        emailVerification.verifyEmail();

        this.emailVerificationRepository.save(emailVerification);

        return makeRight({});
    }
}