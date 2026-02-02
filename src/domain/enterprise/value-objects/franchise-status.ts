import { DomainError } from '@/shared/errors/domain-error';

export type FranchiseStatusType = 'ACTIVE' | 'INACTIVE'

export class FranchiseStatus {
  private constructor(
    private readonly value: FranchiseStatusType
  ) {}

  static active(): FranchiseStatus {
    return new FranchiseStatus('ACTIVE')
  }

  static inactive(): FranchiseStatus {
    return new FranchiseStatus('INACTIVE')
  }

  isActive(): boolean {
    return this.value === 'ACTIVE'
  }

  isInactive(): boolean {
    return this.value === 'INACTIVE'
  }

  getValue(): FranchiseStatusType {
    return this.value
  }

  activate(): FranchiseStatus {
    if (this.isActive()) {
      throw new DomainError('Franchise is already active');
    }

    return FranchiseStatus.active();
  }

  inactivate(): FranchiseStatus {
    if (this.isInactive()) {
      throw new DomainError('Franchise is already inactive');
    }

    return FranchiseStatus.inactive();
  }
}
