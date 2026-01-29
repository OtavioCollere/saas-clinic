import { MfaSettingsRepository } from '../../src/domain/application/repositories/mfa-settings-repository';
import { MfaSettings } from '../../src/domain/enterprise/entities/mfa-settings';

export class InMemoryMfaSettingsRepository extends MfaSettingsRepository {
    public items: MfaSettings[] = [];

    async create(mfaSettings: MfaSettings): Promise<MfaSettings> {
        this.items.push(mfaSettings);
        return mfaSettings;
    }

    async findByUserId(userId: string): Promise<MfaSettings | null> {
        const mfaSettings = this.items.find((item) => item.userId.toString() === userId);
        
        if (!mfaSettings) return null;

        return mfaSettings;
    }

    async save(mfaSettings: MfaSettings): Promise<MfaSettings> {
        const index = this.items.findIndex((item) => item.id.toString() === mfaSettings.id.toString());
        
        if (index === -1) {
            this.items.push(mfaSettings);
        } else {
            this.items[index] = mfaSettings;
        }
        
        return mfaSettings;
    }

    async delete(userId: string): Promise<void> {
        const index = this.items.findIndex((item) => item.userId.toString() === userId);
        
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }
}

