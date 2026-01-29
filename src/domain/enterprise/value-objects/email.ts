import { DomainError } from "../../../core/errors/domain-error"


export class Email {
  private readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(rawEmail: string): Email {
    const normalized = Email.normalize(rawEmail)

    if (!Email.isValid(normalized)) {
      throw new DomainError('Invalid email address')
    }

    return new Email(normalized)
  }

  getValue(): string {
    return this.value
  }

  equals(email: Email): boolean {
    return this.value === email.value
  }

  private static normalize(email: string): string {
    return email.trim().toLowerCase()
  }

  static isValid(email: string): boolean {
    const normalized = Email.normalize(email);
    // regex simples, suficiente para domínio (não RFC overkill)
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    return emailRegex.test(normalized)
  }
}
