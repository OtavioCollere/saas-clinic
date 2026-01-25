import { Entity } from "@/core/entities/entity";
import type { UniqueEntityId } from "@/core/entities/unique-entity-id";
import type { Optional } from "@/core/types/optional";

export interface SessionProps{
  userId: UniqueEntityId;
  fingerprint : {
    ip : string
    userAgent : string
  }
  mfaVerified : boolean // mfa verified da sessao e nao do user
  expiresAt : Date
  createdAt? : Date
  revokedAt? : Date
}

export class Session extends Entity<SessionProps>{
  static create(props: Optional<SessionProps, 'createdAt' | 'revokedAt'>, id?: UniqueEntityId) {
    const session = new Session(
      {
        ...props,
        createdAt: props.createdAt ?? new Date()
      },
      id
    );

    return session;
  }
}