import type { ServiceOrder } from "@/domain/enterprise/entities/service-order";

export class ServiceOrderPresenter {
  static toHTTP(serviceOrder: ServiceOrder) {
    return {
      id: serviceOrder.id.toString(),
      status: serviceOrder.status.getValue(),
      paymentMethod: serviceOrder.paymentMethod,
      total: serviceOrder.calculateTotalAmount(),
      items: serviceOrder.items.map((item) => ({
        id: item.id.toString(),
        appointmentItemId: item.appointmentItemId?.toString() ?? null,
        procedureId: item.procedureId?.toString() ?? null,
        price: item.price,
        notes: item.notes,
      })),
      createdAt: serviceOrder.createdAt.toISOString(),
      updatedAt: serviceOrder.updatedAt?.toISOString(),
    };
  }
}
