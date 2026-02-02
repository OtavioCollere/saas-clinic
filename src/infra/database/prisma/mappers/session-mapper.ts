import { Session } from "@/domain/enterprise/entities/session";
import { UniqueEntityId } from "@/shared/entities/unique-entity-id";
import { SessionStatus } from "@/domain/enterprise/value-objects/session-status";
import type { Prisma } from "@prisma/client";

export class SessionMapper {
  static toDomain(raw: Prisma.SessionGetPayload<{}>): Session {
    return Session.create(
      {
        userId: new UniqueEntityId(raw.userId),
        status: raw.status as SessionStatus,
        fingerprint: raw.fingerprint as { ip: string; userAgent: string },
        mfaVerified: raw.mfaVerified,
        expiresAt: raw.expiresAt,
        createdAt: raw.createdAt,
        revokedAt: raw.revokedAt ?? undefined,
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrisma(session: Session): Prisma.SessionUncheckedCreateInput {
    return {
      id: session.id.toString(),
      userId: session.userId.toString(),
      status: session.status,
      fingerprint: session.fingerprint,
      mfaVerified: session.mfaVerified,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
      revokedAt: session.revokedAt ?? null,
    };
  }
}

