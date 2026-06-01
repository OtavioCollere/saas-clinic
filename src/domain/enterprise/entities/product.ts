import { Entity } from '@/shared/entities/entity';
import { Optional } from '@/shared/types/optional';
import { UniqueEntityId } from '@/shared/entities/unique-entity-id';
import type { ProductsStatus } from '../value-objects/product-status';

export interface ProductProps {
  franchiseId: UniqueEntityId;
  name: string;
  price: number;
  costPrice?: number;
  notes?: string;
  status: ProductsStatus;
  createdAt: Date;
  updatedAt?: Date;
}

export class Product extends Entity<ProductProps> {
  static create(props: Optional<ProductProps, 'createdAt' | 'updatedAt'>, id?: UniqueEntityId) {
    const product = new Product(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
    return product;
  }

  get franchiseId() { return this.props.franchiseId; }
  get name() { return this.props.name; }
  get price() { return this.props.price; }
  get costPrice() { return this.props.costPrice; }
  get notes() { return this.props.notes; }
  get status() { return this.props.status; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt(): Date | undefined { return this.props.updatedAt; }

  set name(name: string) { this.props.name = name; }
  set price(price: number) { this.props.price = price; }
  set costPrice(costPrice: number | undefined) { this.props.costPrice = costPrice; }
  set notes(notes: string | undefined) { this.props.notes = notes; }
  set status(status: ProductsStatus) { this.props.status = status; }
  set updatedAt(updatedAt: Date) { this.props.updatedAt = updatedAt; }
}
