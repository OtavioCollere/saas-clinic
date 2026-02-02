import { Entity } from '@/shared/entities/entity';
import { Optional } from '@/shared/types/optional';
import { UniqueEntityId } from '@/shared/entities/unique-entity-id';

export interface AppointmentItemProps {
  procedureId: UniqueEntityId;
  price: number;
  notes?: string;
}

export class AppointmentItem extends Entity<AppointmentItemProps> {
  static create(props: AppointmentItemProps, id?: UniqueEntityId) {
    const appointmentItem = new AppointmentItem(props, id);
    return appointmentItem;
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