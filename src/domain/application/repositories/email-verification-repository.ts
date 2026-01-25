import { EmailVerification } from "@/domain/enterprise/entities/email-verification";

export type TransactionContext = unknown;

export abstract class EmailVerificationRepository {
    abstract create(
      emailVerification: EmailVerification,
      tx?: TransactionContext,
    ): Promise<EmailVerification>;
  
    abstract transaction<T>(
      fn: (tx: TransactionContext) => Promise<T>,
    ): Promise<T>;

    abstract deleteAllByUserId(userId: string, tx?: TransactionContext): Promise<void>;

    abstract findByToken(token: string): Promise<EmailVerification | null>;

    abstract save(emailVerification: EmailVerification, tx?: TransactionContext): Promise<EmailVerification>;
  }