import { beforeEach, describe, expect, it } from "vitest";
import { SetupMfaUseCase } from "../setup-mfa";
import { InMemoryMfaSettingsRepository } from "tests/in-memory-repositories/in-memory-mfa-settings-repository";
import { FakeMfaService } from "tests/cryptography/fake-mfa-service";
import { isLeft, isRight, unwrapEither } from "@/shared/either/either";
import { MfaAlreadyExistsError } from "@/shared/errors/mfa-already-exists-error";
import { makeMfaSettings } from "tests/factories/makeMfaSettings";
import { UniqueEntityId } from "@/shared/entities/unique-entity-id";

describe('SetupMfaUseCase Unit Tests', () => {
	let sut: SetupMfaUseCase;
	let inMemoryMfaSettingsRepository: InMemoryMfaSettingsRepository;
	let fakeMfaService: FakeMfaService;

	beforeEach(() => {
		inMemoryMfaSettingsRepository = new InMemoryMfaSettingsRepository();
		fakeMfaService = new FakeMfaService();
		sut = new SetupMfaUseCase(inMemoryMfaSettingsRepository, fakeMfaService);
	});

	it('should be able to setup MFA', async () => {
		const userId = new UniqueEntityId().toString();

		const result = await sut.execute({ userId });

		expect(isRight(result)).toBeTruthy();
		if (isRight(result)) {
			const { backupCodes } = unwrapEither(result);
			expect(backupCodes).toHaveLength(10);
			expect(backupCodes[0]).toContain('BACKUP');
			
			const mfaSettings = await inMemoryMfaSettingsRepository.findByUserId(userId);
			expect(mfaSettings).toBeTruthy();
			expect(mfaSettings?.totpEnabled).toBe(false);
			expect(mfaSettings?.totpSecret).toBeTruthy();
		}
	});

	it('should not be able to setup MFA if user already has MFA', async () => {
		const userId = new UniqueEntityId().toString();
		const existingMfa = makeMfaSettings({
			userId: new UniqueEntityId(userId),
		});
		inMemoryMfaSettingsRepository.items.push(existingMfa);

		const result = await sut.execute({ userId });

		expect(isLeft(result)).toBeTruthy();
		expect(unwrapEither(result)).toBeInstanceOf(MfaAlreadyExistsError);
	});
})