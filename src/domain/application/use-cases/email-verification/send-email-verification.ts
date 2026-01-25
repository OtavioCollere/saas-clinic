import { Entity } from '@/core/entities/entity';
import type { UniqueEntityId } from '@/core/entities/unique-entity-id';
import type { Optional } from '@/core/types/optional';
import type { Email } from '../value-objects/email';

export interface EmailVerificationProps {
  userId: UniqueEntityId;
  email: Email;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export class EmailVerification extends Entity<EmailVerificationProps> {
  static create(
    props: Optional<EmailVerificationProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    return new EmailVerification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
  }

  get userId() {
    return this.props.userId;
  }

  get email() {
    return this.props.email;
  }

  get token() {
    return this.props.token;
  }

  get expiresAt() {
    return this.props.expiresAt;
  }

  get createdAt() {
    return this.props.createdAt;
  }
}
