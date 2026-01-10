import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface PatientProps {
  userId?: UniqueEntityId;
  name: string;
  birthDay: Date;
  address: string;
  zipCode: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class Patient extends Entity<PatientProps> {
  static create(props: Optional<PatientProps, "createdAt" | "updatedAt">, id?: UniqueEntityId) {
    const patient = new Patient(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
    return patient;
  }

  get userId() {
    return this.props.userId;
  }

  get name() {
    return this.props.name;
  }

  get birthDay() {
    return this.props.birthDay;
  }

  get address() {
    return this.props.address;
  }

  get zipCode() {
    return this.props.zipCode;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  set userId(userId: UniqueEntityId | undefined) {
    this.props.userId = userId;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set birthDay(birthDay: Date) {
    this.props.birthDay = birthDay;
  }

  set address(address: string) {
    this.props.address = address;
  }

  set zipCode(zipCode: string) {
    this.props.zipCode = zipCode;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }
}