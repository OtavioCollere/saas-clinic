import { isLeft, isRight, unwrapEither } from '@/shared/either/either';
import { makeServiceOrder } from 'test/factories/makeServiceOrder';
import { InMemoryServiceOrderRepository } from 'test/in-memory-repositories/in-memory-service-order-repository';
import { ServiceOrderStatus } from '@/domain/enterprise/value-objects/service-order-status';
import { beforeEach, describe, expect, it } from 'vitest';
import { MarkServiceOrderAsPaidUseCase } from '../mark-service-order-as-paid';
import { ServiceOrderNotFoundError } from '@/shared/errors/service-order-not-found-error';
import { ServiceOrderAlreadyPaidError } from '@/shared/errors/service-order-already-paid-error';

describe('MarkServiceOrderAsPaidUseCase Unit Tests', () => {
  let sut: MarkServiceOrderAsPaidUseCase;
  let inMemoryServiceOrderRepository: InMemoryServiceOrderRepository;

  beforeEach(() => {
    inMemoryServiceOrderRepository = new InMemoryServiceOrderRepository();
    sut = new MarkServiceOrderAsPaidUseCase(inMemoryServiceOrderRepository);
  });

  it('should mark a service order as paid', async () => {
    const order = makeServiceOrder({ status: ServiceOrderStatus.pending() });
    await inMemoryServiceOrderRepository.create(order);

    const result = await sut.execute({ serviceOrderId: order.id.toString() });

    expect(isRight(result)).toBe(true);

    const updated = await inMemoryServiceOrderRepository.findById(order.id.toString());
    expect(updated?.status.isPaid()).toBe(true);
  });

  it('should return ServiceOrderNotFoundError when order does not exist', async () => {
    const result = await sut.execute({ serviceOrderId: 'non-existent-id' });

    expect(isLeft(result)).toBe(true);
    expect(unwrapEither(result)).toBeInstanceOf(ServiceOrderNotFoundError);
  });

  it('should return ServiceOrderAlreadyPaidError when order is already paid', async () => {
    const order = makeServiceOrder({ status: ServiceOrderStatus.paid() });
    await inMemoryServiceOrderRepository.create(order);

    const result = await sut.execute({ serviceOrderId: order.id.toString() });

    expect(isLeft(result)).toBe(true);
    expect(unwrapEither(result)).toBeInstanceOf(ServiceOrderAlreadyPaidError);
  });
});
