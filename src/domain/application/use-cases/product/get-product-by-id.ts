import { Inject, Injectable } from '@nestjs/common';
import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import { ProductNotFoundError } from '@/shared/errors/product-not-found-error';
import { Product } from '@/domain/enterprise/entities/product';
import { ProductRepository } from '../../repositories/product-repository';

interface GetProductByIdUseCaseRequest {
  productId: string;
}

type GetProductByIdUseCaseResponse = Either<ProductNotFoundError, { product: Product }>;

@Injectable()
export class GetProductByIdUseCase {
  constructor(
    @Inject(ProductRepository)
    private productRepository: ProductRepository,
  ) {}

  async execute({ productId }: GetProductByIdUseCaseRequest): Promise<GetProductByIdUseCaseResponse> {
    const product = await this.productRepository.findById(productId);
    if (!product) return makeLeft(new ProductNotFoundError());
    return makeRight({ product });
  }
}
