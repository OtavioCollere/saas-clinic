import { Either, makeLeft, makeRight } from "@/core/either/either";
import { InvalidTotpCodeError } from "@/core/errors/invalid-totp-code-error";
import { MfaAlreadyEnabledError } from "@/core/errors/mfa-already-enabled-error";
import { MfaSettingsNotFoundError } from "@/core/errors/mfa-settings-not-found-error";
import { MfaSettingsRepository } from "@/domain/application/repositories/mfa-settings-repository";
import { MfaService } from "@/domain/services/mfa-service";

interface EnableMfaUseCaseRequest {
    userId: string;
    totpCode: string;
}

type EnableMfaUseCaseResponse = Either<
    Error,
    {
        mfa_status: boolean;
    }
>

export class EnableMfaUseCase{

    constructor(
        private mfaSettingsRepository: MfaSettingsRepository,
        private mfaService: MfaService,
    ) {}

    async execute({ userId, totpCode }: EnableMfaUseCaseRequest): Promise<EnableMfaUseCaseResponse> {
        const mfaSettings = await this.mfaSettingsRepository.findByUserId(userId);

        if (!mfaSettings) {
            return makeLeft(new MfaSettingsNotFoundError());
        }

        if (mfaSettings.totpEnabled) {
            return makeLeft(new MfaAlreadyEnabledError());
        }

        const isTotpValid = this.mfaService.verifyTotp(totpCode, mfaSettings.totpSecret);

        if (!isTotpValid) {
            return makeLeft(new InvalidTotpCodeError());
        }

        mfaSettings.activateMfa();
        await this.mfaSettingsRepository.save(mfaSettings);

        return makeRight({ mfa_status: mfaSettings.totpEnabled });
    }
}