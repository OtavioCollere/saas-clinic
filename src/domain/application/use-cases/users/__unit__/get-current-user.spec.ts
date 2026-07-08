import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryUsersRepository } from 'tests/in-memory-repositories/in-memory-users-repository';
import { isLeft, isRight, unwrapEither } from '@/shared/either/either';
import { makeUser } from 'tests/factories/makeUser';
import { UserNotFoundError } from '@/shared/errors/user-not-found-error';
import { GetCurrentUserUseCase } from '../get-current-user';

describe('GetCurrentUserUseCase Unit Tests', () => {
	let sut: GetCurrentUserUseCase;
	let inMemoryUsersRepository: InMemoryUsersRepository;

	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		sut = new GetCurrentUserUseCase(inMemoryUsersRepository);
	});

	it('should be able to get current user', async () => {
		const user = makeUser();
		inMemoryUsersRepository.items.push(user);

		const result = await sut.execute({
			userId: user.id.toString(),
		});

		expect(isRight(result)).toBeTruthy();
		if (isRight(result)) {
			expect(unwrapEither(result).user.id.toString()).toBe(user.id.toString());
			expect(unwrapEither(result).user.name).toBe(user.name);
			expect(unwrapEither(result).user.email.getValue()).toBe(user.email.getValue());
		}
	});

	it('should not be able to get a non existent user', async () => {
		const result = await sut.execute({
			userId: 'non-existent-user-id',
		});

		expect(isLeft(result)).toBeTruthy();
		expect(unwrapEither(result)).toBeInstanceOf(UserNotFoundError);
	});

	it('should return the correct user when multiple users exist', async () => {
		const user1 = makeUser({ name: 'User 1' });
		const user2 = makeUser({ name: 'User 2' });
		inMemoryUsersRepository.items.push(user1, user2);

		const result = await sut.execute({
			userId: user1.id.toString(),
		});

		expect(isRight(result)).toBeTruthy();
		if (isRight(result)) {
			expect(unwrapEither(result).user.id.toString()).toBe(user1.id.toString());
			expect(unwrapEither(result).user.name).toBe('User 1');
		}
	});
});

