export class Slug {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(text: string): Slug {
    if (!text || text.trim().length === 0) {
      throw new Error('Slug cannot be created from empty text');
    }

    const slug = text
      .normalize('NFD')                 // separa letras de acentos
      .replace(/[\u0300-\u036f]/g, '')  // remove acentos
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')     // remove caracteres inválidos
      .replace(/\s+/g, '-')             // espaços → hífen
      .replace(/-+/g, '-');             // remove hífens duplicados

    if (slug.length === 0) {
      throw new Error('Slug generation resulted in empty value');
    }

    return new Slug(slug);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Slug): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
