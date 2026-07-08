import { ServiceOrder, type ServiceOrderProps } from "@/domain/enterprise/entities/service-order";
import { ServiceOrderStatus } from "@/domain/enterprise/value-objects/service-order-status";
import { PaymentMethod } from "@/domain/enterprise/value-objects/payment-method";

export function makeServiceOrder(override: Partial<ServiceOrderProps> = {}): ServiceOrder {
  return ServiceOrder.create({
    items: [],
    status: ServiceOrderStatus.pending(),
    paymentMethod: PaymentMethod.CASH,
    createdAt: new Date(),
    ...override,
  });
}
