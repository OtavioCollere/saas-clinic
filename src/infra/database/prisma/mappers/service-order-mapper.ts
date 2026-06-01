import { ServiceOrder } from "@/domain/enterprise/entities/service-order";
import { ServiceOrderItem } from "@/domain/enterprise/entities/service-order-item";
import { ServiceOrderStatus } from "@/domain/enterprise/value-objects/service-order-status";
import { PaymentMethod } from "@/domain/enterprise/value-objects/payment-method";
import { UniqueEntityId } from "@/shared/entities/unique-entity-id";

type ServiceOrderItemRaw = {
  id: string;
  serviceOrderId: string;
  appointmentItemId: string | null;
  procedureId: string | null;
  price: number | string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date | null;
};

type ServiceOrderRaw = {
  id: string;
  status: string;
  paymentMethod?: string;
  createdAt: Date;
  updatedAt: Date | null;
  items: ServiceOrderItemRaw[];
};

export class ServiceOrderMapper {
  static toDomain(raw: ServiceOrderRaw): ServiceOrder {
    const status = this.statusFromString(raw.status);
    const items = raw.items.map((item) => {
      const price = typeof item.price === "string" ? parseFloat(item.price) : Number(item.price);
      return ServiceOrderItem.create(
        {
          appointmentItemId: item.appointmentItemId ? new UniqueEntityId(item.appointmentItemId) : undefined,
          procedureId: item.procedureId ? new UniqueEntityId(item.procedureId) : undefined,
          price,
          notes: item.notes ?? undefined,
        },
        new UniqueEntityId(item.id)
      );
    });

    return ServiceOrder.create(
      {
        items,
        status,
        paymentMethod: this.paymentMethodFromString(raw.paymentMethod ?? "cash"),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? undefined,
      },
      new UniqueEntityId(raw.id)
    );
  }

  private static paymentMethodFromString(value: string): PaymentMethod {
    const valid = Object.values(PaymentMethod) as string[];
    return valid.includes(value) ? (value as PaymentMethod) : PaymentMethod.CASH;
  }

  static toPrisma(serviceOrder: ServiceOrder) {
    return {
      id: serviceOrder.id.toString(),
      status: serviceOrder.status.getValue(),
      paymentMethod: serviceOrder.paymentMethod,
      items: {
        create: serviceOrder.items.map((item) => ({
          id: item.id.toString(),
          appointmentItemId: item.appointmentItemId?.toString() ?? null,
          procedureId: item.procedureId?.toString() ?? null,
          price: item.price,
          notes: item.notes ?? null,
        })),
      },
    };
  }

  private static statusFromString(value: string): ServiceOrderStatus {
    switch (value) {
      case "WAITING_PAYMENT":
        return ServiceOrderStatus.waitingPayment();
      case "PAID":
        return ServiceOrderStatus.paid();
      case "CANCELED":
        return ServiceOrderStatus.canceled();
      case "FAILED":
        return ServiceOrderStatus.failed();
      default:
        return ServiceOrderStatus.pending();
    }
  }
}
