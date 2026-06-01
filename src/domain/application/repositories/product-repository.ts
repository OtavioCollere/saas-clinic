import type { Product } from '@/domain/enterprise/entities/product';

export abstract class ProductRepository {
  abstract create(product: Product): Promise<Product>;
  abstract findById(id: string): Promise<Product | null>;
  abstract findByFranchiseId(franchiseId: string): Promise<Product[]>;
  abstract findByClinicId(clinicId: string): Promise<Product[]>;
  abstract update(product: Product): Promise<Product>;
  abstract delete(productId: string): Promise<void>;
}
