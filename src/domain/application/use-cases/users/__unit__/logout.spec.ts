import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryUsersRepository } from 'test/in-memory-repositories/in-memory-users-repository';
import { InMemorySessionsRepository } from 'test/in-memory-repositories/in-memory-sessions-repository';
import { isLeft, isRight, unwrapEither } from '@/shared/either/either';
import { makeUser } from 'test/factories/makeUser';
import { UserNotFoundError } from '@/shared/errors/user-not-found-error';
import { LogoutUseCase } from '../logout';
import { makeSession } from 'test/factories/makeSession';
import { SessionStatus } from '@/domain/enterprise/value-objects/session-status';

describe('LogoutUseCase Unit Tests', () => {
	let sut: LogoutUseCase;
	let inMemoryUsersRepository: InMemoryUsersRepository;
	let inMemorySessionsRepository: InMemorySessionsRepository;

	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		inMemorySessionsRepository = new InMemorySessionsRepository();
		sut = new LogoutUseCase(
			inMemoryUsersRepository,
			inMemorySessionsRepository
		);
	});

	it('should be able to logout a user and revoke all sessions', async () => {
		const user = makeUser();
		inMemoryUsersRepository.items.push(user);

		const session1 = makeSession({
			userId: user.id,
			status: SessionStatus.ACTIVE,
		});
		const session2 = makeSession({
			userId: user.id,
			status: SessionStatus.ACTIVE,
		});
		inMemorySessionsRepository.items.push(session1, session2);

		const result = await sut.execute({
			userId: user.id.toString(),
		});

		expect(isRight(result)).toBeTruthy();

		const updatedSession1 = await inMemorySessionsRepository.findById(session1.id.toString());
		const updatedSession2 = await inMemorySessionsRepository.findById(session2.id.toString());

		expect(updatedSession1?.status).toBe(SessionStatus.REVOKED);
		expect(updatedSession2?.status).toBe(SessionStatus.REVOKED);
		expect(updatedSession1?.revokedAt).toBeDefined();
		expect(updatedSession2?.revokedAt).toBeDefined();
	});

	it('should be able to logout a user with no active sessions', async () => {
		const user = makeUser();
		inMemoryUsersRepository.items.push(user);

		const result = await sut.execute({
			userId: user.id.toString(),
		});

		expect(isRight(result)).toBeTruthy();
	});

	it('should not be able to logout a non existent user', async () => {
		const result = await sut.execute({
			userId: 'non-existent-user-id',
		});

		expect(isLeft(result)).toBeTruthy();
		expect(unwrapEither(result)).toBeInstanceOf(UserNotFoundError);
	});

	it('should revoke only sessions from the specified user', async () => {
		const user1 = makeUser();
		const user2 = makeUser();
		inMemoryUsersRepository.items.push(user1, user2);

		const session1 = makeSession({
			userId: user1.id,
			status: SessionStatus.ACTIVE,
		});
		const session2 = makeSession({
			userId: user2.id,
			status: SessionStatus.ACTIVE,
		});
		inMemorySessionsRepository.items.push(session1, session2);

		const result = await sut.execute({
			userId: user1.id.toString(),
		});

		expect(isRight(result)).toBeTruthy();

		const updatedSession1 = await inMemorySessionsRepository.findById(session1.id.toString());
		const updatedSession2 = await inMemorySessionsRepository.findById(session2.id.toString());

		expect(updatedSession1?.status).toBe(SessionStatus.REVOKED);
		expect(updatedSession2?.status).toBe(SessionStatus.ACTIVE);
	});
});
