import { Entity } from "@/shared/entities/entity";
import type { UniqueEntityId } from "@/shared/entities/unique-entity-id";
import type { Optional } from "@/shared/types/optional";
import { SessionStatus } from "../value-objects/session-status";

export interface SessionProps{
  userId: UniqueEntityId;
  status: SessionStatus
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
  private static readonly SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

  static create(props: Optional<SessionProps, 'createdAt' | 'revokedAt' | 'status' | 'expiresAt'>, id?: UniqueEntityId) {
    const now = new Date();
    const session = new Session(
      {
        ...props,
        status: props.status ?? SessionStatus.PENDING,
        createdAt: props.createdAt ?? now,
        expiresAt: props.expiresAt ?? new Date(now.getTime() + Session.SESSION_DURATION_MS)
      },
      id
    );

    return session;
  }

  get fingerprint() {
    return this.props.fingerprint;
  }

  get userId() {
    return this.props.userId;
  }

  get status() {
    return this.props.status;
  }

  get mfaVerified() {
    return this.props.mfaVerified;
  }

  get expiresAt() {
    return this.props.expiresAt;
  }

  get createdAt() {
    return this.props.createdAt ?? new Date();
  }

  get revokedAt() {
    return this.props.revokedAt;
  }

  revokeSession() {
    this.props.status = SessionStatus.REVOKED;
    this.props.revokedAt = new Date();
  }

  activateSession() {
    this.props.status = SessionStatus.ACTIVE;
    this.props.mfaVerified = true;
  }

  activeSession() {
    return this.props.status === SessionStatus.ACTIVE;
  }

  revokedSession() {
    return this.props.status === SessionStatus.REVOKED;
  }

  expiredSession() {
    return this.props.expiresAt < new Date();
  }
}