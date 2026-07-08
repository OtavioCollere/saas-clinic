import type { PasswordVerification } from "@/domain/enterprise/entities/password-verification";
import type { UniqueEntityId } from "@/shared/entities/unique-entity-id";

export abstract class PasswordVerificationRepository {
  abstract create(passwordVerification: PasswordVerification): Promise<void>;
  abstract update(passwordVerification: PasswordVerification): Promise<void>;
  abstract findByToken(token: string): Promise<PasswordVerification | null>;
  abstract findByUserId(userId: UniqueEntityId): Promise<PasswordVerification | null>;
  abstract delete(passwordVerification: PasswordVerification): Promise<void>;
}