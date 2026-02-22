import { DomainError } from '../../../shared/errors/domain-error';

export class Cnpj {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(rawCnpj: string): Cnpj {
    return new Cnpj(rawCnpj);
  }

  getValue(): string {
    return this.value;
  }

  equals(cnpj: Cnpj): boolean {
    return this.value === cnpj.value;
  }

  private static normalize(cnpj: string): string {
    return cnpj.replace(/\D/g, '');
  }

  static isValid(cnpj: string): boolean {
    cnpj = Cnpj.normalize(cnpj);
    
    if (cnpj.length !== 14) return false;

    // rejeita CNPJs com todos os dígitos iguais
    if (/^(\d)\1+$/.test(cnpj)) return false;

    const digits = cnpj.split('').map(Number);

    // Validação do primeiro dígito verificador
    const firstWeights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const firstSum = digits.slice(0, 12).reduce((acc, digit, index) => {
      return acc + digit * firstWeights[index];
    }, 0);
    const firstRemainder = firstSum % 11;
    const firstDigit = firstRemainder < 2 ? 0 : 11 - firstRemainder;

    if (firstDigit !== digits[12]) return false;

    // Validação do segundo dígito verificador
    const secondWeights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const secondSum = digits.slice(0, 13).reduce((acc, digit, index) => {
      return acc + digit * secondWeights[index];
    }, 0);
    const secondRemainder = secondSum % 11;
    const secondDigit = secondRemainder < 2 ? 0 : 11 - secondRemainder;

    return secondDigit === digits[13];
  }
}








