import { Inject, Injectable } from '@nestjs/common';
import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import { UniqueEntityId } from '@/shared/entities/unique-entity-id';
import { FranchiseNotFoundError } from '@/shared/errors/franchise-not-found-error';
import { Product } from '@/domain/enterprise/entities/product';
import { ProductsStatus } from '@/domain/enterprise/value-objects/product-status';
import { FranchiseRepository } from '../../repositories/franchise-repository';
import { ProductRepository } from '../../repositories/product-repository';

interface CreateProductUseCaseRequest {
  franchiseId: string;
  name: string;
  price: number;
  costPrice?: number;
  notes?: string;
}

type CreateProductUseCaseResponse = Either<FranchiseNotFoundError, { product: Product }>;

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(ProductRepository)
    private productRepository: ProductRepository,
    @Inject(FranchiseRepository)
    private franchiseRepository: FranchiseRepository,
  ) {}

  async execute({ franchiseId, name, price, costPrice, notes }: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {
    const franchise = await this.franchiseRepository.findById(franchiseId);
    if (!franchise) return makeLeft(new FranchiseNotFoundError());

    const product = Product.create({
      franchiseId: new UniqueEntityId(franchiseId),
      name,
      price,
      costPrice,
      notes,
      status: ProductsStatus.active(),
    });

    await this.productRepository.create(product);
    return makeRight({ product });
  }
}
