import { FranchiseStatus } from '../value-objects/franchise-status';
import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface FranchiseProps {
  clinicId: UniqueEntityId;
  name: string;
  address: string;
  zipCode: string;
  status: FranchiseStatus;
  description?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class Franchise extends Entity<FranchiseProps> {
  static create(props: Optional<FranchiseProps, "createdAt" | "updatedAt">, id?: UniqueEntityId) {
    const franchise = new Franchise(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
    return franchise;
  }

  get clinicId() {
    return this.props.clinicId;
  }

  get name() {
    return this.props.name;
  }

  get address() {
    return this.props.address;
  }

  get zipCode() {
    return this.props.zipCode;
  }

  get status() {
    return this.props.status;
  }

  get description() {
    return this.props.description;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  set clinicId(clinicId: UniqueEntityId) {
    this.props.clinicId = clinicId;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set address(address: string) {
    this.props.address = address;
  }

  set zipCode(zipCode: string) {
    this.props.zipCode = zipCode;
  }

  set status(status: FranchiseStatus) {
    this.props.status = status;
  }

  set description(description: string | undefined) {
    this.props.description = description;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }
}