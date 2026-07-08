import type { ServiceOrderRepository } from '../../src/domain/application/repositories/service-order-repository';
import { ServiceOrder } from '../../src/domain/enterprise/entities/service-order';
import { ServiceOrderStatus } from '../../src/domain/enterprise/value-objects/service-order-status';

type ServiceOrderEntry = ServiceOrder & { _franchiseId?: string; _appointmentId?: string };

export class InMemoryServiceOrderRepository implements ServiceOrderRepository {
  public items: ServiceOrderEntry[] = [];

  async create(serviceOrder: ServiceOrder, franchiseId?: string, appointmentId?: string): Promise<void> {
    const entry = serviceOrder as ServiceOrderEntry;
    entry._franchiseId = franchiseId;
    entry._appointmentId = appointmentId;
    this.items.push(entry);
  }

  async findById(id: string): Promise<ServiceOrder | null> {
    return this.items.find((i) => i.id.toString() === id) ?? null;
  }

  async findByFranchiseId(franchiseId: string, status?: string): Promise<ServiceOrder[]> {
    return this.items.filter((i) => {
      if (i._franchiseId !== franchiseId) return false;
      if (status) return i.status.getValue() === status;
      return true;
    });
  }

  async findByPatientId(_patientId: string): Promise<ServiceOrder[]> {
    return this.items;
  }

  async markAsPaid(id: string, paidAt: Date): Promise<void> {
    const index = this.items.findIndex((i) => i.id.toString() === id);
    if (index === -1) throw new Error('ServiceOrder not found');

    const existing = this.items[index];
    const updated = ServiceOrder.create(
      {
        items: existing.items,
        status: ServiceOrderStatus.paid(),
        paymentMethod: existing.paymentMethod,
        createdAt: existing.createdAt,
        updatedAt: paidAt,
      },
      existing.id,
    ) as ServiceOrderEntry;

    updated._franchiseId = existing._franchiseId;
    updated._appointmentId = existing._appointmentId;
    this.items[index] = updated;
  }
}
