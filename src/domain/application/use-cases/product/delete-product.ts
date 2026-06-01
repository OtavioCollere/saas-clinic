import { Inject, Injectable } from '@nestjs/common';
import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import { ProductNotFoundError } from '@/shared/errors/product-not-found-error';
import { ProductRepository } from '../../repositories/product-repository';

interface DeleteProductUseCaseRequest {
  productId: string;
}

type DeleteProductUseCaseResponse = Either<ProductNotFoundError, Record<string, never>>;

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject(ProductRepository)
    private productRepository: ProductRepository,
  ) {}

  async execute({ productId }: DeleteProductUseCaseRequest): Promise<DeleteProductUseCaseResponse> {
    const product = await this.productRepository.findById(productId);
    if (!product) return makeLeft(new ProductNotFoundError());

    await this.productRepository.delete(productId);
    return makeRight({});
  }
}
