import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface AppointmentItemProps {
  appointmentId: UniqueEntityId;
  procedureId: UniqueEntityId;
  price: number;
  notes?: string;
}

export class AppointmentItem extends Entity<AppointmentItemProps> {
  static create(props: AppointmentItemProps, id?: UniqueEntityId) {
    const appointmentItem = new AppointmentItem(props, id);
    return appointmentItem;
  }

  get appointmentId() {
    return this.props.appointmentId;
  }

  get procedureId() {
    return this.props.procedureId;
  }

  get price() {
    return this.props.price;
  }

  get notes() {
    return this.props.notes;
  }

  set appointmentId(appointmentId: UniqueEntityId) {
    this.props.appointmentId = appointmentId;
  }

  set procedureId(procedureId: UniqueEntityId) {
    this.props.procedureId = procedureId;
  }

  set price(price: number) {
    this.props.price = price;
  }

  set notes(notes: string | undefined) {
    this.props.notes = notes;
  }
}