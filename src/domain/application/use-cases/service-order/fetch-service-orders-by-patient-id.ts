import { Inject, Injectable } from '@nestjs/common';
import { type Either, makeRight } from '@/shared/either/either';
import type { ServiceOrder } from '@/domain/enterprise/entities/service-order';
import { ServiceOrderRepository } from '../../repositories/service-order-repository';

interface FetchServiceOrdersByPatientIdUseCaseRequest {
  patientId: string;
}

type FetchServiceOrdersByPatientIdUseCaseResponse = Either<
  never,
  { serviceOrders: ServiceOrder[] }
>;

@Injectable()
export class FetchServiceOrdersByPatientIdUseCase {
  constructor(
    @Inject(ServiceOrderRepository)
    private readonly serviceOrderRepository: ServiceOrderRepository,
  ) {}

  async execute({
    patientId,
  }: FetchServiceOrdersByPatientIdUseCaseRequest): Promise<FetchServiceOrdersByPatientIdUseCaseResponse> {
    const serviceOrders = await this.serviceOrderRepository.findByPatientId(patientId);

    return makeRight({ serviceOrders });
  }
}
