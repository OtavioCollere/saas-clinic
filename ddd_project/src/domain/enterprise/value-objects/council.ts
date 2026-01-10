export type CouncilType = 'CRM' | 'CRBM'

export class Council {
  private constructor(
    private readonly value: CouncilType
  ) {}

  static crm() {
    return new Council('CRM')
  }

  static crbm() {
    return new Council('CRBM')
  }

  getValue(): CouncilType {
    return this.value
  }
}
