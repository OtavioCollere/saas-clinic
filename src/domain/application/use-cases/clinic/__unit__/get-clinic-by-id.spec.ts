import { isLeft, isRight, unwrapEither } from '@/core/either/either';
import { ClinicNotFoundError } from '@/core/errors/clinic-not-found-error';
import { ClinicStatus } from '@/domain/enterprise/value-objects/clinic-status';
import { UserRole } from '@/domain/enterprise/value-objects/user-role';
import { makeClinic } from 'tests/factories/makeClinic';
import { makeUser } from 'tests/factories/makeUser';
import { InMemoryClinicRepository } from 'tests/in-memory-repositories/in-memory-clinic-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetClinicByIdUseCase } from '../get-clinic-by-id';

describe('GetClinicByIdUseCase Unit Tests', () => {
	let sut: GetClinicByIdUseCase;
	let inMemoryClinicRepository: InMemoryClinicRepository;

	beforeEach(() => {
		inMemoryClinicRepository = new InMemoryClinicRepository();
		sut = new GetClinicByIdUseCase(inMemoryClinicRepository);
	});

	it('should be able to get a clinic by id', async () => {
		const owner = makeUser({
			role: UserRole.owner(),
		});
		const clinic = makeClinic({
			ownerId: owner.id,
			name: 'Test Clinic',
			description: 'Test description',
			status: ClinicStatus.active(),
		});
		inMemoryClinicRepository.items.push(clinic);

		const result = await sut.execute({
			clinicId: clinic.id.toString(),
		});

		expect(isRight(result)).toBeTruthy();
		if (isRight(result)) {
			expect(unwrapEither(result).clinic.id.toString()).toEqual(clinic.id.toString());
			expect(unwrapEither(result).clinic.name).toEqual('Test Clinic');
			expect(unwrapEither(result).clinic.description).toEqual('Test description');
			expect(unwrapEither(result).clinic.status.isActive()).toBeTruthy();
		}
	});

	it('should not be able to get a non existent clinic', async () => {
		const result = await sut.execute({
			clinicId: 'non-existent-clinic-id',
		});

		expect(isLeft(result)).toBeTruthy();
		expect(unwrapEither(result)).toBeInstanceOf(ClinicNotFoundError);
	});
});

