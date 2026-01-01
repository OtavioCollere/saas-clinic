import { ProcedureStatus } from './../value-objects/procedure-status';
import { Entity } from "../../../core/entities/entity";
import type { UniqueEntityId } from "../../../core/entities/unique-entity-id";

export interface ProcedureProps{
  franchiseId : UniqueEntityId
  name : string
  price : number
  notes? : string
  status : ProcedureStatus
  createdAt : Date
  updatedAt : Date
}

export class Procedure extends Entity<ProcedureProps>{}