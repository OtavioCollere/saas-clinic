import { Inject, Injectable } from '@nestjs/common';
import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import { ProductNotFoundError } from '@/shared/errors/product-not-found-error';
import { ProductsStatus } from '@/domain/enterprise/value-objects/product-status';
import { ProductRepository } from '../../repositories/product-repository';

interface InactivateProductUseCaseRequest {
  productId: string;
}

type InactivateProductUseCaseResponse = Either<ProductNotFoundError, Record<string, never>>;

@Injectable()
export class InactivateProductUseCase {
  constructor(
    @Inject(ProductRepository)
    private productRepository: ProductRepository,
  ) {}

  async execute({ productId }: InactivateProductUseCaseRequest): Promise<InactivateProductUseCaseResponse> {
    const product = await this.productRepository.findById(productId);
    if (!product) return makeLeft(new ProductNotFoundError());

    product.status = ProductsStatus.inactive();
    product.updatedAt = new Date();

    await this.productRepository.update(product);
    return makeRight({});
  }
}
