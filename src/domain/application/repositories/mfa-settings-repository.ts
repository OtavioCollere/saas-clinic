import type { MfaSettings, MfaSettingsProps } from "@/domain/enterprise/entities/mfa-settings";

export abstract class MfaSettingsRepository {
  abstract create(mfaSettings: MfaSettings): Promise<MfaSettings>;
  abstract findByUserId(userId: string): Promise<MfaSettings | null>;
  abstract save(mfaSettings: MfaSettings): Promise<MfaSettings>;
  abstract delete(userId: string): Promise<void>;
}