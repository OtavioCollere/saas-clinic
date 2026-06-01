import { Entity } from "@/shared/entities/entity";
import { UniqueEntityId } from "@/shared/entities/unique-entity-id";

export interface ServiceOrderItemProps {
    appointmentItemId?: UniqueEntityId
    procedureId?: UniqueEntityId
    productId?: UniqueEntityId
    price: number
    notes?: string
    createdAt: Date
    updatedAt?: Date
}

export class ServiceOrderItem extends Entity<ServiceOrderItemProps> {
    static create(
        props: Omit<ServiceOrderItemProps, 'createdAt'>,
        id?: UniqueEntityId
    ) {
        const serviceOrderItem = new ServiceOrderItem(
            {
                ...props,
                createdAt: new Date(),
            },
            id,
        );

        return serviceOrderItem;
    }

    get appointmentItemId() {
        return this.props.appointmentItemId;
    }

    get procedureId() {
        return this.props.procedureId;
    }

    get productId() {
        return this.props.productId;
    }

    get price() {
        return this.props.price;
    }

    get notes() {
        return this.props.notes;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    updatePrice(price: number) {
        this.props.price = price;
        this.props.updatedAt = new Date();
    }

    updateNotes(notes?: string) {
        this.props.notes = notes;
        this.props.updatedAt = new Date();
    }
}
