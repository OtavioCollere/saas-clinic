import { Entity } from "../../../core/entities/entity";
import type { UniqueEntityId } from "../../../core/entities/unique-entity-id";

export interface AppointmentItemProps {
  appointmentId : UniqueEntityId
  procedureId : UniqueEntityId
  price : number
  notes?: string
}

export class AppointmentItem extends Entity<AppointmentItemProps>{}