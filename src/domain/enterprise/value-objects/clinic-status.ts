import { DomainError } from '../../../core/errors/domain-error';

export type ClinicStatusType = 'ACTIVE' | 'INACTIVE';

export class ClinicStatus {
  private constructor(private readonly value: ClinicStatusType) {}

  static active() {
    return new ClinicStatus('ACTIVE');
  }

  static inactive() {
    return new ClinicStatus('INACTIVE');
  }

  isActive(): boolean {
    return this.value === 'ACTIVE';
  }

  isInactive(): boolean {
    return this.value === 'INACTIVE';
  }

  getValue(): ClinicStatusType {
    return this.value;
  }

  activate(): ClinicStatus {
    if (this.isActive()) {
      throw new DomainError('Clinic is already active');
    }

    return ClinicStatus.active();
  }

  inactivate(): ClinicStatus {
    if (this.isInactive()) {
      throw new DomainError('Clinic is already inactive');
    }

    return ClinicStatus.inactive();
  }
}
