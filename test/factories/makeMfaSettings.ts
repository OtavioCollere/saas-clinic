import { MfaSettings, type MfaSettingsProps } from "@/domain/enterprise/entities/mfa-settings";
import { UniqueEntityId } from "@/shared/entities/unique-entity-id";

export function makeMfaSettings(override: Partial<MfaSettingsProps> = {}): MfaSettings {
	const mfaSettings = MfaSettings.create({
		userId: new UniqueEntityId(),
		totpEnabled: false,
		totpSecret: "fake-secret",
		backupCodes: [],
		...override,
	});

	return mfaSettings;
}
