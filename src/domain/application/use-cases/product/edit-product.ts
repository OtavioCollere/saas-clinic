import { Inject, Injectable } from '@nestjs/common';
import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import { ProductNotFoundError } from '@/shared/errors/product-not-found-error';
import { Product } from '@/domain/enterprise/entities/product';
import { ProductRepository } from '../../repositories/product-repository';

interface EditProductUseCaseRequest {
  productId: string;
  name?: string;
  price?: number;
  costPrice?: number;
  notes?: string;
}

type EditProductUseCaseResponse = Either<ProductNotFoundError, { product: Product }>;

@Injectable()
export class EditProductUseCase {
  constructor(
    @Inject(ProductRepository)
    private productRepository: ProductRepository,
  ) {}

  async execute({ productId, name, price, costPrice, notes }: EditProductUseCaseRequest): Promise<EditProductUseCaseResponse> {
    const product = await this.productRepository.findById(productId);
    if (!product) return makeLeft(new ProductNotFoundError());

    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    if (costPrice !== undefined) product.costPrice = costPrice;
    if (notes !== undefined) product.notes = notes;
    product.updatedAt = new Date();

    await this.productRepository.update(product);
    return makeRight({ product });
  }
}
