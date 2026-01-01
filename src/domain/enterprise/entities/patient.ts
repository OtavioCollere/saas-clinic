import { Profession } from './../value-objects/profession';
import { Council } from './../value-objects/council';
import { Entity } from "../../../core/entities/entity";
import type { UniqueEntityId } from "../../../core/entities/unique-entity-id";

export interface PatientProps {
  userId : UniqueEntityId
  name : string
  birthDay : Date
  address : string
  zipCode : string
  createdAt : Date
  updatedAt : Date
}

export class Patient extends Entity<PatientProps>{}