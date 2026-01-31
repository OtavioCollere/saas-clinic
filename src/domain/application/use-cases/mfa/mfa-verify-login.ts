import { Injectable } from "@nestjs/common";
import { Either, makeLeft, makeRight } from "@/shared/either/either";
import { InvalidTotpCodeError } from "@/shared/errors/invalid-totp-code-error";
import { MfaSettingsNotFoundError } from "@/shared/errors/mfa-settings-not-found-error";
import { MfaSettingsRepository } from "@/domain/application/repositories/mfa-settings-repository";
import { SessionsRepository } from "@/domain/application/repositories/sessions-repository";
import { MfaService } from "@/domain/services/mfa-service";
import { Session } from "@/domain/enterprise/entities/session";
import { UniqueEntityId } from "@/shared/entities/unique-entity-id";
import { Encrypter } from "@/domain/application/cryptography/encrypter";

interface MfaVerifyLoginUseCaseRequest {
    userId: string;
    sessionId: string;
    totpCode: string;
    fingerprint: {
        ip: string;
        userAgent: string;
    }
}

type MfaVerifyLoginUseCaseResponse = Either<
    InvalidTotpCodeError | MfaSettingsNotFoundError,
    {
        access_token: string,
        refresh_token: string
    }
>
@Injectable()
export class MfaVerifyLoginUseCase {

    constructor(
        private mfaSettingsRepository: MfaSettingsRepository,
        private mfaService: MfaService,
        private sessionsRepository: SessionsRepository,
        private encrypter: Encrypter
    ) {}

    async execute({ userId, sessionId, totpCode, fingerprint }: MfaVerifyLoginUseCaseRequest): Promise<MfaVerifyLoginUseCaseResponse> {
        const mfaSettings = await this.mfaSettingsRepository.findByUserId(userId);

        if (!mfaSettings) {
            return makeLeft(new MfaSettingsNotFoundError());
        }

        const isTotpValid = this.mfaService.verifyTotp(totpCode, mfaSettings.totpSecret);

        if (!isTotpValid) {
            return makeLeft(new InvalidTotpCodeError());
        }

        let session = await this.sessionsRepository.findById(sessionId);
        if (session && !session.expiredSession()) {
            session.revokeSession()
            await this.sessionsRepository.update(session);
        } else {
            session = Session.create({
                userId: new UniqueEntityId(userId),
                fingerprint,
                mfaVerified: true,
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
            })

            await this.sessionsRepository.create(session);
        }

        const accessToken = await this.encrypter.sign({
            userId: userId,
            sessionId,
            fingerprint
        })

        const refreshToken = await this.encrypter.refresh({
            userId: userId,
            sessionId,
            fingerprint
        })

        return makeRight({ 
            access_token: accessToken,
            refresh_token: refreshToken
        });
    }
}