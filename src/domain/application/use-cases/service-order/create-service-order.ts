import { ServiceOrder } from "@/domain/enterprise/entities/service-order";
import { ServiceOrderItem } from "@/domain/enterprise/entities/service-order-item";
import { ServiceOrderStatus } from "@/domain/enterprise/value-objects/service-order-status";
import type { ServiceOrderStatusType } from "@/domain/enterprise/value-objects/service-order-status";
import { PaymentMethod } from "@/domain/enterprise/value-objects/payment-method";
import { makeLeft, makeRight, type Either } from "@/shared/either/either";
import { AppointmentItemNotFoundError } from "@/shared/errors/appointment-item-not-found-error";
import { ServiceOrderRepository } from "../../repositories/service-order-repository";
import { Inject } from "@nestjs/common";
import { UniqueEntityId } from "@/shared/entities/unique-entity-id";

export type PaymentMethodType = keyof typeof PaymentMethod | (typeof PaymentMethod)[keyof typeof PaymentMethod];

export interface ServiceOrderItemInput {
  appointmentItemId?: string;
  procedureId?: string;
  price: number;
  notes?: string;
}

interface CreateServiceOrderUseCaseRequest {
  items: ServiceOrderItemInput[];
  status?: ServiceOrderStatusType;
  paymentMethod?: PaymentMethodType;
}

type CreateServiceOrderUseCaseResponse = Either<
  AppointmentItemNotFoundError,
  {
    serviceOrder: ServiceOrder;
  }
>;

export class CreateServiceOrderUseCase {
  constructor(
    @Inject(ServiceOrderRepository)
    private readonly serviceOrderRepository: ServiceOrderRepository,
  ) {}

  async execute({
    items: itemInputs,
    status,
    paymentMethod: paymentMethodInput,
  }: CreateServiceOrderUseCaseRequest): Promise<CreateServiceOrderUseCaseResponse> {
    if (itemInputs.length === 0) {
      return makeLeft(new AppointmentItemNotFoundError());
    }

    const items = itemInputs.map((input) =>
      ServiceOrderItem.create({
        appointmentItemId: input.appointmentItemId ? new UniqueEntityId(input.appointmentItemId) : undefined,
        procedureId: input.procedureId ? new UniqueEntityId(input.procedureId) : undefined,
        price: input.price,
        notes: input.notes,
      })
    );

    const statusValue = (() => {
      switch (status) {
        case "WAITING_PAYMENT": return ServiceOrderStatus.waitingPayment();
        case "PAID": return ServiceOrderStatus.paid();
        case "CANCELED": return ServiceOrderStatus.canceled();
        case "FAILED": return ServiceOrderStatus.failed();
        default: return ServiceOrderStatus.pending();
      }
    })();

    const paymentMethodValue = (() => {
      const val = paymentMethodInput ?? PaymentMethod.CASH;
      if (Object.values(PaymentMethod).includes(val as PaymentMethod)) {
        return val as PaymentMethod;
      }
      return PaymentMethod.CASH;
    })();

    const serviceOrder = ServiceOrder.create({
      items,
      status: statusValue,
      paymentMethod: paymentMethodValue,
    });

    await this.serviceOrderRepository.create(serviceOrder);

    return makeRight({ serviceOrder });
  }
}