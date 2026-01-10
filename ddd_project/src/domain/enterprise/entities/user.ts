import { Email } from '../value-objects/email';
import { Cpf } from '../value-objects/cpf';
import type { UserRole } from '../value-objects/user-role';
import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface UserProps{
  name : string
  cpf : Cpf 
  email : Email 
  password : string
  role : UserRole
  updatedAt? : Date
  createdAt : Date
}

export class User extends Entity<UserProps>{
  static create(props: Optional<UserProps, "createdAt" | "updatedAt">, id?: UniqueEntityId) {
    const user = new User(
      {
        ...props,
        createdAt: props.createdAt ?? new Date()
      },
      id,
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
}