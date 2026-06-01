import { Inject, Injectable } from '@nestjs/common';
import { type Either, makeRight } from '@/shared/either/either';
import { Product } from '@/domain/enterprise/entities/product';
import { ProductRepository } from '../../repositories/product-repository';

interface FetchProductsByClinicIdUseCaseRequest {
  clinicId: string;
}

type FetchProductsByClinicIdUseCaseResponse = Either<never, { products: Product[] }>;

@Injectable()
export class FetchProductsByClinicIdUseCase {
  constructor(
    @Inject(ProductRepository)
    private productRepository: ProductRepository,
  ) {}

  async execute({ clinicId }: FetchProductsByClinicIdUseCaseRequest): Promise<FetchProductsByClinicIdUseCaseResponse> {
    const products = await this.productRepository.findByClinicId(clinicId);
    return makeRight({ products });
  }
}
