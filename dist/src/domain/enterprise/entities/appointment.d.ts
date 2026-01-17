import { AppointmentStatus } from '../value-objects/appointment-status';
import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import type { AppointmentItem } from './appointment-item';
export interface AppointmentProps {
    professionalId: UniqueEntityId;
    franchiseId: UniqueEntityId;
    patientId: UniqueEntityId;
    name: string;
    appointmentItems: AppointmentItem[];
    startAt: Date;
    endAt: Date;
    status: AppointmentStatus;
    createdAt: Date;
    updatedAt?: Date;
}
export declare class Appointment extends Entity<AppointmentProps> {
    static create(props: Optional<AppointmentProps, "createdAt" | "updatedAt">, id?: UniqueEntityId): Appointment;
    get professionalId(): UniqueEntityId;
    get franchiseId(): UniqueEntityId;
    get patientId(): UniqueEntityId;
    get name(): string;
    get appointmentItems(): AppointmentItem[];
    get startAt(): Date;
    get endAt(): Date;
    get status(): AppointmentStatus;
    get createdAt(): Date;
    get updatedAt(): Date | undefined;
    set professionalId(professionalId: UniqueEntityId);
    set franchiseId(franchiseId: UniqueEntityId);
    set patientId(patientId: UniqueEntityId);
    set name(name: string);
    set appointmentItems(appointmentItems: AppointmentItem[]);
    set startAt(startAt: Date);
    set endAt(endAt: Date);
    set status(status: AppointmentStatus);
    set updatedAt(updatedAt: Date);
}
