import type { Product } from '@/domain/enterprise/entities/product';

export class ProductPresenter {
  static toHTTP(product: Product) {
    return {
      id: product.id.toString(),
      franchiseId: product.franchiseId.toString(),
      name: product.name,
      price: product.price,
      costPrice: product.costPrice ?? null,
      notes: product.notes ?? null,
      status: product.status.getValue(),
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt?.toISOString() ?? null,
    };
  }
}
