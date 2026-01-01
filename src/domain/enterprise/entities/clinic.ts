import { Entity } from "../../../core/entities/entity";
import type { UniqueEntityId } from "../../../core/entities/unique-entity-id";

export interface ClinicProps{
  name: string
  ownerId : UniqueEntityId
  createdAt : Date
  updatedAt : Date
}

export class Clinic extends Entity<ClinicProps>{}