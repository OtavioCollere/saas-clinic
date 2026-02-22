import { Entity } from "@/shared/entities/entity";
import type { UniqueEntityId } from "@/shared/entities/unique-entity-id";
import type { Optional } from "@/shared/types/optional";

export interface PasswordVerificationProps {
  userId: UniqueEntityId;
  token: string;
  expiresAt?: Date | null;
  usedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class PasswordVerification extends Entity<PasswordVerificationProps> {
  private static readonly EXPIRATION_TIME = 60 * 60 * 1000; // 1 hora

  static create(
    props: Optional<PasswordVerificationProps, "createdAt" | "updatedAt" | "usedAt">,
    id?: UniqueEntityId
  ) {
    const passwordVerification = new PasswordVerification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        usedAt: props.usedAt ?? null,
        expiresAt : props.expiresAt ?? new Date(Date.now() + PasswordVerification.EXPIRATION_TIME),
      },
      id
    );
    return passwordVerification;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  get userId(): UniqueEntityId {
    return this.props.userId;
  }

  get token(): string {
    return this.props.token;
  }

  get expiresAt(): Date | null {
    return this.props.expiresAt ?? null;
  }

  get usedAt(): Date | null {
    return this.props.usedAt ?? null;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  set usedAt(usedAt: Date | null) {
    this.props.usedAt = usedAt;
    this.touch();
  }

  isTokenExpired(): boolean {
    if (!this.props.expiresAt) return false;
    return new Date() > this.props.expiresAt;
  }

  isTokenUsed(): boolean {
    return this.props.usedAt !== null && this.props.usedAt !== undefined;
  }

  isValid(): boolean {
    return !this.isTokenExpired() && !this.isTokenUsed();
  }

  markAsUsed(): void {
    if (this.isTokenUsed()) {
      throw new Error("Token already used");
    }
    if (this.isTokenExpired()) {
      throw new Error("Token expired");
    }
    this.props.usedAt = new Date();
    this.touch();
  }

  static getExpirationTime(): number {
    return PasswordVerification.EXPIRATION_TIME;
  }
}