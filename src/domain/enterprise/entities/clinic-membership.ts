import { Entity } from '@/shared/entities/entity';
import { Optional } from '@/shared/types/optional';
import { UniqueEntityId } from '@/shared/entities/unique-entity-id';
import { ClinicRole } from '../value-objects/clinic-role';

export interface ClinicMembershipProps {
  userId: UniqueEntityId;
  clinicId: UniqueEntityId;
  role: ClinicRole;
  createdAt: Date;
  updatedAt?: Date;
}

export class ClinicMembership extends Entity<ClinicMembershipProps> {
  static create(
    props: Optional<ClinicMembershipProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityId
  ) {
    const membership = new ClinicMembership(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
    return membership;
  }

  get userId() {
    return this.props.userId;
  }

  get clinicId() {
    return this.props.clinicId;
  }

  get role() {
    return this.props.role;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  set userId(userId: UniqueEntityId) {
    this.props.userId = userId;
  }

  set clinicId(clinicId: UniqueEntityId) {
    this.props.clinicId = clinicId;
  }

  set role(role: ClinicRole) {
    this.props.role = role;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }
}