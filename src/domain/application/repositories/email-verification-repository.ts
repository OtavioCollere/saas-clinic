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
  }
  