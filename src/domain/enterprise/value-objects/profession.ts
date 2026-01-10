export type ProfessionType = 'MEDICO' | 'BIOMEDICO'

export class Profession {
  private constructor(
    private readonly value: ProfessionType
  ) {}

  static medico() {
    return new Profession('MEDICO')
  }

  static biomedico() {
    return new Profession('BIOMEDICO')
  }

  isMedico(): boolean {
    return this.value === 'MEDICO'
  }

  isBiomedico(): boolean {
    return this.value === 'BIOMEDICO'
  }

  getValue(): ProfessionType {
    return this.value
  }
}
