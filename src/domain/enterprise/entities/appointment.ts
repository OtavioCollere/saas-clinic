import { AppointmentStatus } from './../value-objects/appointment-status';
import { Entity } from "../../../core/entities/entity";
import type { UniqueEntityId } from "../../../core/entities/unique-entity-id";
import type { AppointmentItem } from './appointment-item';

export interface AppointmentProps {
  professionalId : UniqueEntityId
  franchiseId : UniqueEntityId
  patientId : UniqueEntityId
  name : string
  appointmentItems : AppointmentItem[]
  startAt : Date
  endAt : Date
  status : AppointmentStatus
  createdAt : Date
  updatedAt :  Date
}

export class Appointment extends Entity<AppointmentProps>{}