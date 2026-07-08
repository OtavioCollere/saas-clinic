import type { ServiceOrder } from "@/domain/enterprise/entities/service-order";

export abstract class ServiceOrderRepository {
  abstract create(serviceOrder: ServiceOrder, franchiseId?: string, appointmentId?: string): Promise<void>;
  abstract findById(id: string): Promise<ServiceOrder | null>;
  abstract findByFranchiseId(franchiseId: string, status?: string): Promise<ServiceOrder[]>;
  abstract findByPatientId(patientId: string): Promise<ServiceOrder[]>;
  abstract markAsPaid(id: string, paidAt: Date): Promise<void>;
}
