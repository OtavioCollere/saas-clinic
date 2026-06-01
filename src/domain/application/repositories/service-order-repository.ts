import type { ServiceOrder } from "@/domain/enterprise/entities/service-order";

export abstract class ServiceOrderRepository {
  abstract create(serviceOrder: ServiceOrder): Promise<void>;
  abstract findById(id: string): Promise<ServiceOrder | null>;
  abstract markConsumptionStatus(id: string, status: "CONFIRMED" | "SKIPPED"): Promise<void>;
}