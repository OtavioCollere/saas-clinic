import { Either, makeLeft, makeRight } from "@/core/either/either";
import { InvalidTotpCodeError } from "@/core/errors/invalid-totp-code-error";
import { MfaSettingsNotFoundError } from "@/core/errors/mfa-settings-not-found-error";
import { MfaSettingsRepository } from "@/domain/application/repositories/mfa-settings-repository";
import { SessionsRepository } from "@/domain/application/repositories/sessions-repository";
import { MfaService } from "@/domain/services/mfa-service";
import { Session } from "@/domain/enterprise/entities/session";
import { SessionStatus } from "@/domain/enterprise/value-objects/session-status";

interface MfaVerifyLoginUseCaseRequest {
    userId: string;
    sessionId: string;
    totpCode: string;
}

type MfaVerifyLoginUseCaseResponse = Either<
    InvalidTotpCodeError | MfaSettingsNotFoundError,
    {
        mfa_status: boolean;
        sid: string;
    }
>
export class MfaVerifyLoginUseCase {

    constructor(
        private mfaSettingsRepository: MfaSettingsRepository,
        private mfaService: MfaService,
        private sessionsRepository: SessionsRepository,
    ) {}

    async execute({ userId, sessionId, totpCode }: MfaVerifyLoginUseCaseRequest): Promise<MfaVerifyLoginUseCaseResponse> {
        const mfaSettings = await this.mfaSettingsRepository.findByUserId(userId);

        if (!mfaSettings) {
            return makeLeft(new MfaSettingsNotFoundError());
        }

        const isTotpValid = this.mfaService.verifyTotp(totpCode, mfaSettings.totpSecret);

        if (!isTotpValid) {
            return makeLeft(new InvalidTotpCodeError());
        }

        const session = await this.sessionsRepository.findById(sessionId);

        if (!session) {
            return makeLeft(new InvalidTotpCodeError());
        }

        // Verify session belongs to user
        if (session.userId.toString() !== userId) {
            return makeLeft(new InvalidTotpCodeError());
        }

        // Verify session is in PENDING status (waiting for MFA)
        if (session.status !== SessionStatus.PENDING) {
            return makeLeft(new InvalidTotpCodeError());
        }

        // Activate session and mark MFA as verified
        session.activateSession();

        await this.sessionsRepository.update(session);

        return makeRight({ mfa_status: true, sid: session.id.toString() });
    }
}