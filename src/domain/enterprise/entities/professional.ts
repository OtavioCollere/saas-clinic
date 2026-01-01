import { Profession } from './../value-objects/profession';
import { Council } from './../value-objects/council';
import { Entity } from "../../../core/entities/entity";
import type { UniqueEntityId } from "../../../core/entities/unique-entity-id";

export interface ProfessionalProps {
  franchiseId : UniqueEntityId
  userId : UniqueEntityId
  council : Council
  councilNumber : string
  councilState : string
  profession : Profession
  createdAt : Date
  updatedAt : Date
}

export class Professional extends Entity<ProfessionalProps>{}