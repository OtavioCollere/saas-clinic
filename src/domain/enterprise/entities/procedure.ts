import { ProcedureStatus } from '../value-objects/procedure-status';
import { Entity } from '@/shared/entities/entity';
import { Optional } from '@/shared/types/optional';
import { UniqueEntityId } from '@/shared/entities/unique-entity-id';

export interface ProcedureProps {
  franchiseId: UniqueEntityId;
  name: string;
  price: number;
  notes?: string;
  status: ProcedureStatus;
  createdAt: Date;
  updatedAt?: Date;
}

export class Procedure extends Entity<ProcedureProps> {
  static create(props: Optional<ProcedureProps, "createdAt" | "updatedAt">, id?: UniqueEntityId) {
    const procedure = new Procedure(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
    return procedure;
  }

  get franchiseId() {
    return this.props.franchiseId;
  }

  get name() {
    return this.props.name;
  }

  get price() {
    return this.props.price;
  }

  get notes() {
    return this.props.notes;
  }

  get status() {
    return this.props.status;
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

  set name(name: string) {
    this.props.name = name;
  }

  set price(price: number) {
    this.props.price = price;
  }

  set notes(notes: string | undefined) {
    this.props.notes = notes;
  }

  set status(status: ProcedureStatus) {
    this.props.status = status;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }
}