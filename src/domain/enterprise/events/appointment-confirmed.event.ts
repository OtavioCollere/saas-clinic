import type { ServiceOrderStatusType } from '@/domain/enterprise/value-objects/service-order-status';
import type { PaymentMethod } from '@/domain/enterprise/value-objects/payment-method';

export interface ServiceOrderItemPayload {
  appointmentItemId?: string;
  procedureId?: string;
  productId?: string;
  price: number;
  notes?: string;
}

export class AppointmentConfirmedEvent {
  constructor(
    public readonly appointmentId: string,
    public readonly items: ServiceOrderItemPayload[],
    public readonly status?: ServiceOrderStatusType,
    public readonly paymentMethod?: PaymentMethod,
  ) {}
}
