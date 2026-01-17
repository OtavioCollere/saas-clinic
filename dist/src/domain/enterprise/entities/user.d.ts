import { Entity } from '@/core/entities/entity';
import type { UniqueEntityId } from '@/core/entities/unique-entity-id';
import type { Optional } from '@/core/types/optional';
import type { Cpf } from '../value-objects/cpf';
import type { Email } from '../value-objects/email';
import type { UserRole } from '../value-objects/user-role';
export interface UserProps {
    name: string;
    cpf: Cpf;
    email: Email;
    password: string;
    role: UserRole;
    updatedAt?: Date;
    createdAt: Date;
}
export declare class User extends Entity<UserProps> {
    static create(props: Optional<UserProps, 'createdAt' | 'updatedAt'>, id?: UniqueEntityId): User;
    get name(): string;
    get cpf(): Cpf;
    get email(): Email;
    get password(): string;
    get role(): UserRole;
    get updatedAt(): Date | undefined;
    get createdAt(): Date;
    set name(name: string);
    set cpf(cpf: Cpf);
    set email(email: Email);
    set password(password: string);
    set role(role: UserRole);
    set updatedAt(updatedAt: Date);
}
