import { Inject, Injectable } from '@nestjs/common';
import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import { ServiceOrderRepository } from '../../repositories/service-order-repository';
import { ServiceOrderNotFoundError } from '@/shared/errors/service-order-not-found-error';
import { ServiceOrderAlreadyPaidError } from '@/shared/errors/service-order-already-paid-error';

interface MarkServiceOrderAsPaidUseCaseRequest {
  serviceOrderId: string;
}

type MarkServiceOrderAsPaidUseCaseResponse = Either<
  ServiceOrderNotFoundError | ServiceOrderAlreadyPaidError,
  void
>;

@Injectable()
export class MarkServiceOrderAsPaidUseCase {
  constructor(
    @Inject(ServiceOrderRepository)
    private readonly serviceOrderRepository: ServiceOrderRepository,
  ) {}

  async execute({
    serviceOrderId,
  }: MarkServiceOrderAsPaidUseCaseRequest): Promise<MarkServiceOrderAsPaidUseCaseResponse> {
    const serviceOrder = await this.serviceOrderRepository.findById(serviceOrderId);

    if (!serviceOrder) {
      return makeLeft(new ServiceOrderNotFoundError());
    }

    if (serviceOrder.status.isPaid()) {
      return makeLeft(new ServiceOrderAlreadyPaidError());
    }

    await this.serviceOrderRepository.markAsPaid(serviceOrderId, new Date());

    return makeRight(undefined);
  }
}
