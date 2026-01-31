import { MfaSettings } from "@/domain/enterprise/entities/mfa-settings";
import { UniqueEntityId } from "@/shared/entities/unique-entity-id";
import type { Prisma } from "@prisma/client";

export class MfaSettingsMapper {
  static toDomain(raw: Prisma.MfaSettingsGetPayload<{}>): MfaSettings {
    return MfaSettings.create(
      {
        userId: new UniqueEntityId(raw.userId),
        totpEnabled: raw.totpEnabled,
        totpSecret: raw.totpSecret ?? undefined,
        backupCodes: raw.backupCodes,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? undefined,
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrisma(mfaSettings: MfaSettings): Prisma.MfaSettingsUncheckedCreateInput {
    return {
      id: mfaSettings.id.toString(),
      userId: mfaSettings.userId.toString(),
      totpEnabled: mfaSettings.totpEnabled,
      totpSecret: mfaSettings.totpSecret || null,
      backupCodes: mfaSettings.backupCodes,
      createdAt: mfaSettings.createdAt,
      // updatedAt é omitido - Prisma gerencia automaticamente com @updatedAt
    };
  }
}

