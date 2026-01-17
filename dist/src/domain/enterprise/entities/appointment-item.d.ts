import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
export interface AppointmentItemProps {
    appointmentId: UniqueEntityId;
    procedureId: UniqueEntityId;
    price: number;
    notes?: string;
}
export declare class AppointmentItem extends Entity<AppointmentItemProps> {
    static create(props: AppointmentItemProps, id?: UniqueEntityId): AppointmentItem;
    get appointmentId(): UniqueEntityId;
    get procedureId(): UniqueEntityId;
    get price(): number;
    get notes(): string | undefined;
    set appointmentId(appointmentId: UniqueEntityId);
    set procedureId(procedureId: UniqueEntityId);
    set price(price: number);
    set notes(notes: string | undefined);
}
