import { makeLeft } from "@/core/either/either";
import { EmailVerificationRepository } from "../../repositories/email-verification-repository";
import { UsersRepository } from "../../repositories/users-repository";
import { UserNotFoundError } from "@/core/errors/user-not-found-error";


export class VerifyEmailUseCase {
    constructor(
        private usersRepository: UsersRepository,
        private emailVerificationRepository: EmailVerificationRepository
    ){}

    async execute({token, email}: VerifyEmailUseCaseRequest) {
        const emailVerification = await this.emailVerificationRepository.findByToken(token);

        if (!emailVerification) {
            return makeLeft(new EmailVerificationNotFoundError());
        }

        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            return makeLeft(new UserNotFoundError());
        }

        const isTokenExpired = emailVerification.expiresAt < new Date();

        if (isTokenExpired) {
            return makeLeft(new EmailVerificationExpiredError());
        }

        const isTokenUsed = emailVerification.verifiedAt !== null;

        if (isTokenUsed) {
            return makeLeft(new EmailVerificationAlreadyUsedError());
        }

        user.emailVerified = true;
        emailVerification.verifedAt = new Date();

        this.emailVerificationRepository.save(emailVerification);

        return makeRight({});
    }
}