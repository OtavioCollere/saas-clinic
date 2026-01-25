import { Entity } from "@/core/entities/entity";
import type { UniqueEntityId } from "@/core/entities/unique-entity-id";

export interface MfaSettingsProps{
  userId: UniqueEntityId;
  totpEnabled : boolean
  totpSecret : string
  backupCodes : string[]
}

export class MfaSettings extends Entity<MfaSettingsProps>{}