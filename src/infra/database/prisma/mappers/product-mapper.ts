import { Product } from '@/domain/enterprise/entities/product';
import { UniqueEntityId } from '@/shared/entities/unique-entity-id';
import { ProductsStatus } from '@/domain/enterprise/value-objects/product-status';
import type { Decimal } from '@prisma/client/runtime/library';

type ProductRaw = {
  id: string;
  franchiseId: string;
  name: string;
  price: number | string | Decimal;
  costPrice: number | string | Decimal | null;
  notes: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

type ProductPrismaCreateInput = {
  id: string;
  franchise: { connect: { id: string } };
  name: string;
  price: number | string;
  costPrice?: number | string | null;
  notes?: string | null;
  status: string;
  createdAt: Date;
};

type ProductPrismaUpdateInput = {
  name?: string;
  price?: number | string;
  costPrice?: number | string | null;
  notes?: string | null;
  status?: string;
  updatedAt?: Date;
};

export class ProductMapper {
  static toDomain(raw: ProductRaw): Product {
    const status = raw.status === 'ACTIVE'
      ? ProductsStatus.active()
      : ProductsStatus.inactive();

    const toNumber = (val: number | string | Decimal | null | undefined) => {
      if (val == null) return undefined;
      return typeof val === 'number' ? val : parseFloat(val.toString());
    };

    return Product.create(
      {
        franchiseId: new UniqueEntityId(raw.franchiseId),
        name: raw.name,
        price: toNumber(raw.price) ?? 0,
        costPrice: toNumber(raw.costPrice),
        notes: raw.notes ?? undefined,
        status,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? undefined,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrisma(product: Product): ProductPrismaCreateInput {
    return {
      id: product.id.toString(),
      franchise: { connect: { id: product.franchiseId.toString() } },
      name: product.name,
      price: product.price,
      costPrice: product.costPrice ?? null,
      notes: product.notes ?? null,
      status: product.status.getValue(),
      createdAt: product.createdAt,
    };
  }

  static toPrismaUpdate(product: Product): ProductPrismaUpdateInput {
    return {
      name: product.name,
      price: product.price,
      costPrice: product.costPrice ?? null,
      notes: product.notes ?? null,
      status: product.status.getValue(),
      updatedAt: new Date(),
    };
  }
}
