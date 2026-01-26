import { Either, makeLeft, makeRight } from "@/core/either/either";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { MfaAlreadyExistsError } from "@/core/errors/mfa-already-exists-error";
import { MfaSettingsRepository } from "@/domain/application/repositories/mfa-settings-repository";
import { MfaSettings } from "@/domain/enterprise/entities/mfa-settings";
import { MfaService } from "@/domain/services/mfa-service";

interface SetupMfaUseCaseRequest {
    userId: string;
}

type SetupMfaUseCaseResponse = Either<
    Error,
    {
        backupCodes: string[];
    }
>

export class SetupMfaUseCase {
    constructor(
        private mfaSettingsRepository: MfaSettingsRepository,
        private mfaService: MfaService,
    ) {}

    async execute({ userId }: SetupMfaUseCaseRequest): Promise<SetupMfaUseCaseResponse> {

        const mfaExists = await this.mfaSettingsRepository.findByUserId(userId);
    
        if (mfaExists) {
            return makeLeft(new MfaAlreadyExistsError());
        }

        const totpSecret = this.mfaService.generateTotpSecret();
        const { plainCodes, hashedCodes } = this.mfaService.generateBackupCodes();

        const mfaSettings = MfaSettings.create({
            userId: new UniqueEntityId(userId),
            totpSecret,
            backupCodes: hashedCodes
        });

        await this.mfaSettingsRepository.create(mfaSettings);

        return makeRight({ backupCodes: plainCodes });
    }
}