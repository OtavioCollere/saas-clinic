import { Inject, Injectable } from '@nestjs/common';
import { type Either, makeRight } from '@/shared/either/either';
import type { ServiceOrder } from '@/domain/enterprise/entities/service-order';
import { ServiceOrderRepository } from '../../repositories/service-order-repository';

interface FetchServiceOrdersByFranchiseIdUseCaseRequest {
  franchiseId: string;
  status?: string;
}

type FetchServiceOrdersByFranchiseIdUseCaseResponse = Either<
  never,
  { serviceOrders: ServiceOrder[] }
>;

@Injectable()
export class FetchServiceOrdersByFranchiseIdUseCase {
  constructor(
    @Inject(ServiceOrderRepository)
    private readonly serviceOrderRepository: ServiceOrderRepository,
  ) {}

  async execute({
    franchiseId,
    status,
  }: FetchServiceOrdersByFranchiseIdUseCaseRequest): Promise<FetchServiceOrdersByFranchiseIdUseCaseResponse> {
    const serviceOrders = await this.serviceOrderRepository.findByFranchiseId(franchiseId, status);

    return makeRight({ serviceOrders });
  }
}
