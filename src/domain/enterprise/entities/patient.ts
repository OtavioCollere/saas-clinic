import { Entity } from '@/shared/entities/entity';
import type { UniqueEntityId } from '@/shared/entities/unique-entity-id';
import type { Optional } from '@/shared/types/optional';
import type { Anamnesis } from './anamnesis/anamnesis';

export interface PatientProps {
  clinicId: UniqueEntityId;
  userId: UniqueEntityId;
  anamnesis?: Anamnesis;
  name: string;
  phone?: string;
  birthDay: Date;
  address: string;
  zipCode: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class Patient extends Entity<PatientProps> {
  static create(props: Optional<PatientProps, 'createdAt' | 'updatedAt' | 'anamnesis'>, id?: UniqueEntityId) {
    const patient = new Patient(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
    return patient;
  }

  get clinicId() {
    return this.props.clinicId;
  }

  get userId() {
    return this.props.userId;
  }

  get anamnesis(): Anamnesis | undefined {
    return this.props.anamnesis;
  }

  get name() {
    return this.props.name;
  }

  get phone(): string | undefined {
    return this.props.phone;
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

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  set clinicId(clinicId: UniqueEntityId) {
    this.props.clinicId = clinicId;
  }

  set userId(userId: UniqueEntityId) {
    this.props.userId = userId;
  }

  set anamnesis(anamnesis: Anamnesis) {
    this.props.anamnesis = anamnesis;
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
