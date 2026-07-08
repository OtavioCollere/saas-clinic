import { DomainError } from '@/shared/errors/domain-error';

export type ProfessionalStatusType = 'ACTIVE' | 'INACTIVE'

export class ProfessionalStatus {
  private constructor(
    private readonly value: ProfessionalStatusType
  ) {}

  static active(): ProfessionalStatus {
    return new ProfessionalStatus('ACTIVE')
  }

  static inactive(): ProfessionalStatus {
    return new ProfessionalStatus('INACTIVE')
  }

  isActive(): boolean {
    return this.value === 'ACTIVE'
  }

  isInactive(): boolean {
    return this.value === 'INACTIVE'
  }

  getValue(): ProfessionalStatusType {
    return this.value
  }

  activate(): ProfessionalStatus {
    if (this.isActive()) {
      throw new DomainError('Professional is already active');
    }
    return ProfessionalStatus.active();
  }

  inactivate(): ProfessionalStatus {
    if (this.isInactive()) {
      throw new DomainError('Professional is already inactive');
    }
    return ProfessionalStatus.inactive();
  }
}
