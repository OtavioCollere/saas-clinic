export const AESTHETIC_REGIONS = [
  'Testa',
  'Glabela',
  'Olhos / Pés de galinha',
  'Nariz',
  'Lábios',
  'Sulco nasolabial',
  'Bochecha / Malar',
  'Queixo',
  'Mandíbula',
  'Pescoço / Platisma',
  'Décolleté',
  'Mãos',
  'Corpo',
  'Outro',
] as const;

export type AestheticRegionType = (typeof AESTHETIC_REGIONS)[number];

export class AestheticRegion {
  private constructor(private readonly value: AestheticRegionType) {}

  static create(value: string): AestheticRegion | null {
    if (AESTHETIC_REGIONS.includes(value as AestheticRegionType)) {
      return new AestheticRegion(value as AestheticRegionType);
    }
    return null;
  }

  static isValid(value: string): boolean {
    return AESTHETIC_REGIONS.includes(value as AestheticRegionType);
  }

  getValue(): AestheticRegionType {
    return this.value;
  }
}
