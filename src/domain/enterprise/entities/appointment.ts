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

export class Appointment extends Entity<AppointmentProps> {
  static create(props: Optional<AppointmentProps, "createdAt" | "updatedAt">, id?: UniqueEntityId) {
    const appointment = new Appointment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
    return appointment;
  }

  get professionalId() {
    return this.props.professionalId;
  }

  get franchiseId() {
    return this.props.franchiseId;
  }

  get patientId() {
    return this.props.patientId;
  }

  get name() {
    return this.props.name;
  }

  get appointmentItems() {
    return this.props.appointmentItems;
  }

  get startAt() {
    return this.props.startAt;
  }

  get endAt() {
    return this.props.endAt;
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

  set professionalId(professionalId: UniqueEntityId) {
    this.props.professionalId = professionalId;
  }

  set franchiseId(franchiseId: UniqueEntityId) {
    this.props.franchiseId = franchiseId;
  }

  set patientId(patientId: UniqueEntityId) {
    this.props.patientId = patientId;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set appointmentItems(appointmentItems: AppointmentItem[]) {
    this.props.appointmentItems = appointmentItems;
  }

  set startAt(startAt: Date) {
    this.props.startAt = startAt;
  }

  set endAt(endAt: Date) {
    this.props.endAt = endAt;
  }

  set status(status: AppointmentStatus) {
    this.props.status = status;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }
}