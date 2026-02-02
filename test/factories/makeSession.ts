import { Session, type SessionProps } from "@/domain/enterprise/entities/session";
import { UniqueEntityId } from "@/shared/entities/unique-entity-id";
import { SessionStatus } from "@/domain/enterprise/value-objects/session-status";

export function makeSession(override: Partial<SessionProps> = {}): Session {
	const session = Session.create({
		userId: new UniqueEntityId(),
		status: SessionStatus.PENDING,
		fingerprint: {
			ip: "127.0.0.1",
			userAgent: "test-agent",
		},
		mfaVerified: false,
		...override,
	});

	return session;
}
