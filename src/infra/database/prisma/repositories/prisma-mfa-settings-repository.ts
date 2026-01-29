import { Inject, Injectable } from "@nestjs/common";
import { MfaSettingsRepository } from "@/domain/application/repositories/mfa-settings-repository";
import { MfaSettings } from "@/domain/enterprise/entities/mfa-settings";
import { PrismaService } from "../../prisma.service";
import { MfaSettingsMapper } from "../mappers/mfa-settings-mapper";

@Injectable()
export class PrismaMfaSettingsRepository extends MfaSettingsRepository {
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaService
  ) {
    super();
  }

  async create(mfaSettings: MfaSettings): Promise<MfaSettings> {
    const data = MfaSettingsMapper.toPrisma(mfaSettings);

    const raw = await this.prisma.mfaSettings.create({
      data,
    });

    return MfaSettingsMapper.toDomain(raw);
  }

  async findByUserId(userId: string): Promise<MfaSettings | null> {
    const raw = await this.prisma.mfaSettings.findUnique({
      where: { userId },
    });

    if (!raw) return null;

    return MfaSettingsMapper.toDomain(raw);
  }

  async save(mfaSettings: MfaSettings): Promise<MfaSettings> {
    const data = MfaSettingsMapper.toPrisma(mfaSettings);

    const raw = await this.prisma.mfaSettings.upsert({
      where: { userId: mfaSettings.userId.toString() },
      create: data,
      update: {
        totpEnabled: data.totpEnabled,
        totpSecret: data.totpSecret,
        backupCodes: data.backupCodes,
        // updatedAt é gerenciado automaticamente pelo Prisma com @updatedAt
      },
    });

    return MfaSettingsMapper.toDomain(raw);
  }

  async delete(userId: string): Promise<void> {
    await this.prisma.mfaSettings.delete({
      where: { userId },
    });
  }
}

