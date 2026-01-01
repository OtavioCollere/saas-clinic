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
}
