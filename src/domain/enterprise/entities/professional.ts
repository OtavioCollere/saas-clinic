import { Profession } from '../value-objects/profession';
import { Council } from '../value-objects/council';
import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface ProfessionalProps {
  franchiseId: UniqueEntityId;
  userId: UniqueEntityId;
  council: Council;
  councilNumber: string;
  councilState: string;
  profession: Profession;
  createdAt: Date;
  updatedAt?: Date;
}

export class Professional extends Entity<ProfessionalProps> {
  static create(props: Optional<ProfessionalProps, "createdAt" | "updatedAt">, id?: UniqueEntityId) {
    const professional = new Professional(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
    return professional;
  }

  get franchiseId() {
    return this.props.franchiseId;
  }

  get userId() {
    return this.props.userId;
  }

  get council() {
    return this.props.council;
  }

  get councilNumber() {
    return this.props.councilNumber;
  }

  get councilState() {
    return this.props.councilState;
  }

  get profession() {
    return this.props.profession;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  set franchiseId(franchiseId: UniqueEntityId) {
    this.props.franchiseId = franchiseId;
  }

  set userId(userId: UniqueEntityId) {
    this.props.userId = userId;
  }

  set council(council: Council) {
    this.props.council = council;
  }

  set councilNumber(councilNumber: string) {
    this.props.councilNumber = councilNumber;
  }

  set councilState(councilState: string) {
    this.props.councilState = councilState;
  }

  set profession(profession: Profession) {
    this.props.profession = profession;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }
}