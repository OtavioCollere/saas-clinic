import { Either, makeLeft, makeRight } from "@/core/either/either";
import { WrongCredentialsError } from "@/core/errors/wrong-credentials-error";
import { UsersRepository } from "../../repositories/users-repository";
import { HashComparer } from "../../cryptography/hash-comparer";
import { Encrypter } from "../../cryptography/encrypter";
import type { ClinicMembershipRepository } from "../../repositories/clinic-membership-repository";
import type { SessionsRepository } from "../../repositories/sessions-repository";
import { Session } from "@/domain/enterprise/entities/session";
import type { MfaSettingsRepository } from "../../repositories/mfa-settings-repository";

interface AuthenticateUserUseCaseRequest{
    email: string;
    password: string;
    fingerprint: {
        ip: string;
        userAgent: string;
    }
}

type AuthenticateUserUseCaseResponse = Either<WrongCredentialsError,
{
    refresh_token: string;
    access_token: string;
} | 
{
    session_id: string;
    mfa_required: boolean;
}
>

export class AuthenticateUserUseCase{
    constructor(
        private usersRepository: UsersRepository,
        private hashComparer: HashComparer,
        private encrypter: Encrypter,
        private sessionsRepository: SessionsRepository,
        private mfaSettingsRepository: MfaSettingsRepository,
    ){}

    async execute({email, password, fingerprint}: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            return makeLeft(new WrongCredentialsError())
        }

        const doesPasswordMatches = await this.hashComparer.compare(password, user.password);

        if (!doesPasswordMatches) {
            return makeLeft(new WrongCredentialsError())
        }

        const sessionExists = await this.sessionsRepository.findByUserId(user.id.toString());
        if (sessionExists.length > 0) {
            // reaproveitar sesao
        }

        const session = Session.create({
            userId : user.id,
            fingerprint,
            mfaVerified : false,
            expiresAt : new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        })

        const isMfaEnabled = await this.mfaSettingsRepository.findByUserId(user.id.toString());

        if (isMfaEnabled) {
            return makeRight({
                session_id : session.id.toString(),
                mfa_required : true,
            })
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