import type { ServiceOrderRepository } from '../../src/domain/application/repositories/service-order-repository';
import type { ServiceOrder } from '../../src/domain/enterprise/entities/service-order';

export class InMemoryServiceOrderRepository implements ServiceOrderRepository {
  public items: ServiceOrder[] = [];

  async create(serviceOrder: ServiceOrder): Promise<void> {
    this.items.push(serviceOrder);
  }
}
