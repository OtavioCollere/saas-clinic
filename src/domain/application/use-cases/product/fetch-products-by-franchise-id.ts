import { Inject, Injectable } from '@nestjs/common';
import { type Either, makeRight } from '@/shared/either/either';
import { Product } from '@/domain/enterprise/entities/product';
import { ProductRepository } from '../../repositories/product-repository';

interface FetchProductsByFranchiseIdUseCaseRequest {
  franchiseId: string;
}

type FetchProductsByFranchiseIdUseCaseResponse = Either<never, { products: Product[] }>;

@Injectable()
export class FetchProductsByFranchiseIdUseCase {
  constructor(
    @Inject(ProductRepository)
    private productRepository: ProductRepository,
  ) {}

  async execute({ franchiseId }: FetchProductsByFranchiseIdUseCaseRequest): Promise<FetchProductsByFranchiseIdUseCaseResponse> {
    const products = await this.productRepository.findByFranchiseId(franchiseId);
    return makeRight({ products });
  }
}
