import { Entity } from "@/shared/entities/entity";
import { UniqueEntityId } from "@/shared/entities/unique-entity-id";
import { ServiceOrderItem } from "./service-order-item";
import { ServiceOrderStatus } from "../value-objects/service-order-status";
import { PaymentMethod } from "@/domain/enterprise/value-objects/payment-method";

export interface ServiceOrderProps {
    items: ServiceOrderItem[]
    status: ServiceOrderStatus
    paymentMethod: PaymentMethod
    totalAmount?: number
    createdAt: Date
    updatedAt?: Date
}

// valor por padrao vai ser calculado automatico 
// Porém o profissional tambem pode colocar um valor x manual

// No use case de criar servico, sempre vai receber dois arrays
// Array de appointmentitems -> copia dos appointment items ( pode ser nulo )
// AppointmentsToRemove -> array de appointment items que serão removidos
// newAppointmentItems -> array de appointment items que serão adicionados

// status
// PENDING / WAITING_PAYMENT / PAID / CANCELED / FAILED

export class ServiceOrder extends Entity<ServiceOrderProps> {
    static create(
        props: Partial<ServiceOrderProps>,
        id?: UniqueEntityId
    ) {
        const serviceOrder = new ServiceOrder(
            {
                items: props.items ?? [],
                status: props.status ?? ServiceOrderStatus.pending(),
                paymentMethod: props.paymentMethod ?? PaymentMethod.CASH,
                totalAmount: props.totalAmount,
                createdAt: props.createdAt ?? new Date(),
                updatedAt: props.updatedAt,
            },
            id,
        );

        return serviceOrder;
    }

    get paymentMethod() {
        return this.props.paymentMethod;
    }

    calculateTotalAmount() {
        return this.props.items.reduce((total, item) => total + item.price, 0);
    }

    get items() {
        return this.props.items;
    }

    get status() {
        return this.props.status;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    get total() {
        return this.calculateTotal();
    }

    private calculateTotal() {
        return this.props.items.reduce(
            (total, item) => total + item.price,
            0,
        );
    }

    addItem(item: ServiceOrderItem) {
        if (!this.props.status.isPending()) {
            throw new Error('Cannot add items to a non-pending service order');
        }

        this.props.items.push(item);
        this.props.updatedAt = new Date();
    }

    removeItem(itemId: UniqueEntityId) {
        if (!this.props.status.isPending()) {
            throw new Error('Cannot remove items from a non-pending service order');
        }

        this.props.items = this.props.items.filter(
            item => !item.id.equals(itemId),
        );

        this.props.updatedAt = new Date();
    }

    confirm() {
        if (!this.props.status.isPending()) {
            throw new Error('Only pending service orders can be confirmed');
        }

        if (this.props.items.length === 0) {
            throw new Error('Service order must have at least one item');
        }

        this.props.status = ServiceOrderStatus.waitingPayment();
        this.props.updatedAt = new Date();

        // futuramente: disparar ServiceOrderConfirmedEvent
    }

    markAsPaid() {
        if (!this.props.status.isWaitingPayment()) {
            throw new Error('Service order must be waiting payment');
        }

        this.props.status = ServiceOrderStatus.paid();
        this.props.updatedAt = new Date();
    }

    cancel() {
        if (this.props.status.isPaid()) {
            throw new Error('Paid service orders cannot be canceled');
        }

        this.props.status = ServiceOrderStatus.canceled();
        this.props.updatedAt = new Date();
    }
}
