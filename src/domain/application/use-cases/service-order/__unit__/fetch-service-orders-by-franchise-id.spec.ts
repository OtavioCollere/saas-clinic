import { isRight, unwrapEither } from '@/shared/either/either';
import { makeServiceOrder } from 'test/factories/makeServiceOrder';
import { InMemoryServiceOrderRepository } from 'test/in-memory-repositories/in-memory-service-order-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { FetchServiceOrdersByFranchiseIdUseCase } from '../fetch-service-orders-by-franchise-id';
import { UniqueEntityId } from '@/shared/entities/unique-entity-id';

describe('FetchServiceOrdersByFranchiseIdUseCase Unit Tests', () => {
  let sut: FetchServiceOrdersByFranchiseIdUseCase;
  let inMemoryServiceOrderRepository: InMemoryServiceOrderRepository;

  beforeEach(() => {
    inMemoryServiceOrderRepository = new InMemoryServiceOrderRepository();
    sut = new FetchServiceOrdersByFranchiseIdUseCase(inMemoryServiceOrderRepository);
  });

  it('should fetch service orders by franchise id', async () => {
    const franchiseId = new UniqueEntityId();

    const order1 = makeServiceOrder();
    const order2 = makeServiceOrder();
    const otherOrder = makeServiceOrder();

    await inMemoryServiceOrderRepository.create(order1, franchiseId.toString());
    await inMemoryServiceOrderRepository.create(order2, franchiseId.toString());
    await inMemoryServiceOrderRepository.create(otherOrder, new UniqueEntityId().toString());

    const result = await sut.execute({ franchiseId: franchiseId.toString() });

    expect(isRight(result)).toBe(true);
    expect(unwrapEither(result).serviceOrders).toHaveLength(2);
  });

  it('should return empty array when franchise has no service orders', async () => {
    const result = await sut.execute({ franchiseId: new UniqueEntityId().toString() });

    expect(isRight(result)).toBe(true);
    expect(unwrapEither(result).serviceOrders).toHaveLength(0);
  });

  it('should filter by status when provided', async () => {
    const franchiseId = new UniqueEntityId();
    const { ServiceOrderStatus } = await import('@/domain/enterprise/value-objects/service-order-status');

    const pendingOrder = makeServiceOrder({ status: ServiceOrderStatus.pending() });
    const paidOrder = makeServiceOrder({ status: ServiceOrderStatus.paid() });

    await inMemoryServiceOrderRepository.create(pendingOrder, franchiseId.toString());
    await inMemoryServiceOrderRepository.create(paidOrder, franchiseId.toString());

    const result = await sut.execute({ franchiseId: franchiseId.toString(), status: 'PENDING' });

    expect(isRight(result)).toBe(true);
    expect(unwrapEither(result).serviceOrders).toHaveLength(1);
    expect(unwrapEither(result).serviceOrders[0].status.getValue()).toBe('PENDING');
  });
});
