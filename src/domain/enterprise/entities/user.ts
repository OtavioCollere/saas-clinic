import { Entity } from '@/shared/entities/entity';
import type { UniqueEntityId } from '@/shared/entities/unique-entity-id';
import type { Optional } from '@/shared/types/optional';
import type { Cpf } from '../value-objects/cpf';
import type { Email } from '../value-objects/email';
import type { UserRole } from '../value-objects/user-role';

export interface UserProps {
  name: string;
  cpf: Cpf;
  email: Email;
  isEmailVerified?: boolean;
  password: string;
  role: UserRole;
  updatedAt?: Date;
  createdAt: Date;
}

export class User extends Entity<UserProps> {
  static create(props: Optional<UserProps, 'createdAt' | 'updatedAt'>, id?: UniqueEntityId) {
    const user = new User(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        isEmailVerified: props.isEmailVerified ?? false,
      },
      id
    );
    return user;
  }

  get name() {
    return this.props.name;
  }

  get cpf() {
    return this.props.cpf;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get role() {
    return this.props.role;
  }

  get isEmailVerified() {
    return this.props.isEmailVerified ?? false;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set cpf(cpf: Cpf) {
    this.props.cpf = cpf;
  }

  set email(email: Email) {
    this.props.email = email;
  }

  set password(password: string) {
    this.props.password = password;
  }

  set role(role: UserRole) {
    this.props.role = role;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }

  set isEmailVerified(isEmailVerified: boolean) {
    this.props.isEmailVerified = isEmailVerified;
  }

  verifyEmail() {
    this.props.isEmailVerified = true
  }
}
