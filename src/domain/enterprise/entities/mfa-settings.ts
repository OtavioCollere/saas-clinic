import { Entity } from "@/core/entities/entity";
import type { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface MfaSettingsProps{
  userId: UniqueEntityId;
  totpEnabled? : boolean
  totpSecret? : string
  backupCodes? : string[]
  createdAt: Date
  updatedAt?: Date
}

export class MfaSettings extends Entity<MfaSettingsProps>{
  static create(props: Optional<MfaSettingsProps, 'createdAt' | 'updatedAt' | 'totpEnabled'>, id?: UniqueEntityId) {
    const mfaSettings = new MfaSettings(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        totpEnabled: props.totpEnabled ?? false,
      },
      id
    );
    return mfaSettings;
  }

  get userId() {
    return this.props.userId;
  }

  get totpEnabled() {
    return this.props.totpEnabled ?? false;
  }

  get totpSecret() {
    return this.props.totpSecret ?? '';
  }

  get backupCodes() {
    return this.props.backupCodes ?? [];
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  set userId(userId: UniqueEntityId) {
    this.props.userId = userId;
  }

  set totpEnabled(totpEnabled: boolean) {
    this.props.totpEnabled = totpEnabled;
  }

  set totpSecret(totpSecret: string) {
    this.props.totpSecret = totpSecret;
  }

  set backupCodes(backupCodes: string[]) {
    this.props.backupCodes = backupCodes;
  }

  activateMfa() {
    this.props.totpEnabled = true;
  }

  deactivateMfa() {
    this.props.totpEnabled = false;
  }


}