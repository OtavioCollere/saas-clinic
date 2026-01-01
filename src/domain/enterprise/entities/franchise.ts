import { FranchiseStatus } from './../value-objects/franchise-status';
import { Entity } from "../../../core/entities/entity";
import type { UniqueEntityId } from "../../../core/entities/unique-entity-id";

export interface FranchiseProps{
  clinicId : UniqueEntityId
  name : string
  address : string
  zipCode : string
  status : FranchiseStatus
  description?: string
  createdAt : Date
  updatedAt : Date
}

export class Franchise extends Entity<FranchiseProps>{}