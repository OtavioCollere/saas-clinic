import { DomainError } from './../../../core/errors/domain-error';


export class Cpf {
  private readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(rawCpf: string): Cpf {
    const normalized = Cpf.normalize(rawCpf)

    if (!Cpf.isValid(normalized)) {
      throw new DomainError('Invalid CPF')
    }

    return new Cpf(normalized)
  }

  getValue(): string {
    return this.value
  }

  equals(cpf: Cpf): boolean {
    return this.value === cpf.value
  }

  private static normalize(cpf: string): string {
    return cpf.replace(/\D/g, '')
  }

  private static isValid(cpf: string): boolean {
    if (cpf.length !== 11) return false

    // rejeita CPFs com todos os dígitos iguais
    if (/^(\d)\1+$/.test(cpf)) return false

    const digits = cpf.split('').map(Number)

    const calcDigit = (base: number[]) => {
      const sum = base.reduce(
        (acc, digit, index) => acc + digit * (base.length + 1 - index),
        0
      )

      const mod = (sum * 10) % 11
      return mod === 10 ? 0 : mod
    }

    const firstCheck = calcDigit(digits.slice(0, 9))
    const secondCheck = calcDigit(digits.slice(0, 10))

    return (
      firstCheck === digits[9] &&
      secondCheck === digits[10]
    )
  }
}
