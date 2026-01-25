import type { Session } from "node:inspector";

export abstract class SessionsRepository {
  abstract create(session: Session): Promise<Session>;
  abstract findById(id: string): Promise<Session | null>;
  abstract findByUserId(userId: string): Promise<Session[]>;
  abstract update(session: Session): Promise<Session>;
  abstract delete(id: string): Promise<void>;
}