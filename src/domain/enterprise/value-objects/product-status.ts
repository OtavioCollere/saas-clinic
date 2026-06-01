export type ProductsStatusType = 'ACTIVE' | 'INACTIVE'

export class ProductsStatus {
  private constructor( 
    private readonly value: ProductsStatusType
  ) {}

  static active(): ProductsStatus {
    return new ProductsStatus('ACTIVE')
  }

  static inactive(): ProductsStatus {
    return new ProductsStatus('INACTIVE')
  }

  isActive(): boolean {
    return this.value === 'ACTIVE'
  }

  isInactive(): boolean {
    return this.value === 'INACTIVE'
  }

  getValue(): ProductsStatusType {
    return this.value
  }
}
