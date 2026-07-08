import { Entity } from '@/shared/entities/entity';
import type { UniqueEntityId } from '@/shared/entities/unique-entity-id';
import type { Optional } from '@/shared/types/optional';
import type { Council } from '../value-objects/council';
import type { Profession } from '../value-objects/profession';
import { ProfessionalStatus } from '../value-objects/professional-status';

export interface ProfessionalProps {
  franchiseId: UniqueEntityId;
  userId: UniqueEntityId;
  council?: Council;
  councilNumber?: string;
  councilState?: string;
  profession: Profession;
  status: ProfessionalStatus;
  createdAt: Date;
  updatedAt?: Date;
}

export class Professional extends Entity<ProfessionalProps> {
  static create(
    props: Optional<ProfessionalProps, 'createdAt' | 'updatedAt' | 'council' | 'councilNumber' | 'councilState' | 'status'>,
    id?: UniqueEntityId
  ) {
    const professional = new Professional(
      {
        ...props,
        status: props.status ?? ProfessionalStatus.active(),
        createdAt: props.createdAt ?? new Date(),
      },
      id
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

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  set franchiseId(franchiseId: UniqueEntityId) {
    this.props.franchiseId = franchiseId;
  }

  set userId(userId: UniqueEntityId) {
    this.props.userId = userId;
  }

  set council(council: Council | undefined) {
    this.props.council = council;
  }

  set councilNumber(councilNumber: string | undefined) {
    this.props.councilNumber = councilNumber;
  }

  set councilState(councilState: string | undefined) {
    this.props.councilState = councilState;
  }

  set profession(profession: Profession) {
    this.props.profession = profession;
  }

  get status(): ProfessionalStatus {
    return this.props.status;
  }

  set status(status: ProfessionalStatus) {
    this.props.status = status;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }
}
