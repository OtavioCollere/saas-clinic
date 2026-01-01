export type ProcedureStatusType = 'ACTIVE' | 'INACTIVE'

export class ProcedureStatus {
  private constructor(
    private readonly value: ProcedureStatusType
  ) {}

  static active(): ProcedureStatus {
    return new ProcedureStatus('ACTIVE')
  }

  static inactive(): ProcedureStatus {
    return new ProcedureStatus('INACTIVE')
  }

  isActive(): boolean {
    return this.value === 'ACTIVE'
  }

  isInactive(): boolean {
    return this.value === 'INACTIVE'
  }

  getValue(): ProcedureStatusType {
    return this.value
  }
}
