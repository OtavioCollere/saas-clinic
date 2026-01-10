import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface ClinicProps {
  name: string;
  ownerId: UniqueEntityId;
  createdAt: Date;
  updatedAt?: Date;
}

export class Clinic extends Entity<ClinicProps> {
  static create(props: Optional<ClinicProps, "createdAt" | "updatedAt">, id?: UniqueEntityId) {
    const clinic = new Clinic(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
    return clinic;
  }

  get name() {
    return this.props.name;
  }

  get ownerId() {
    return this.props.ownerId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set ownerId(ownerId: UniqueEntityId) {
    this.props.ownerId = ownerId;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }
}