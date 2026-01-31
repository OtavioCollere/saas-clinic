import { beforeEach, describe, expect, it } from "vitest";
import { EnableMfaUseCase } from "../enable-mfa";
import { InMemoryMfaSettingsRepository } from "tests/in-memory-repositories/in-memory-mfa-settings-repository";
import { FakeMfaService } from "tests/cryptography/fake-mfa-service";
import { isLeft, isRight, unwrapEither } from "@/shared/either/either";
import { MfaSettingsNotFoundError } from "@/shared/errors/mfa-settings-not-found-error";
import { MfaAlreadyEnabledError } from "@/shared/errors/mfa-already-enabled-error";
import { InvalidTotpCodeError } from "@/shared/errors/invalid-totp-code-error";
import { makeMfaSettings } from "tests/factories/makeMfaSettings";
import { UniqueEntityId } from "@/shared/entities/unique-entity-id";

describe('EnableMfaUseCase Unit Tests', () => {
	let sut: EnableMfaUseCase;
	let inMemoryMfaSettingsRepository: InMemoryMfaSettingsRepository;
	let fakeMfaService: FakeMfaService;

	beforeEach(() => {
		inMemoryMfaSettingsRepository = new InMemoryMfaSettingsRepository();
		fakeMfaService = new FakeMfaService();
		sut = new EnableMfaUseCase(inMemoryMfaSettingsRepository, fakeMfaService);
	});

	it('should be able to enable MFA', async () => {
		const userId = new UniqueEntityId().toString();
		const totpSecret = "fake-secret-123";
		const totpCode = "123456";
		
		const mfaSettings = makeMfaSettings({
			userId: new UniqueEntityId(userId),
			totpEnabled: false,
			totpSecret,
		});
		inMemoryMfaSettingsRepository.items.push(mfaSettings);

		fakeMfaService.setTotpVerificationResult(totpCode, totpSecret, true);

		const result = await sut.execute({ userId, totpCode });

		expect(isRight(result)).toBeTruthy();
		if (isRight(result)) {
			const { mfa_status } = unwrapEither(result);
			expect(mfa_status).toBe(true);
			
			const updatedMfaSettings = await inMemoryMfaSettingsRepository.findByUserId(userId);
			expect(updatedMfaSettings?.totpEnabled).toBe(true);
		}
	});

	it('should not be able to enable MFA if MFA settings not found', async () => {
		const userId = new UniqueEntityId().toString();
		const totpCode = "123456";

		const result = await sut.execute({ userId, totpCode });

		expect(isLeft(result)).toBeTruthy();
		expect(unwrapEither(result)).toBeInstanceOf(MfaSettingsNotFoundError);
	});

	it('should not be able to enable MFA if user already has MFA enabled', async () => {
		const userId = new UniqueEntityId().toString();
		const totpSecret = "fake-secret-123";
		const totpCode = "123456";
		
		const mfaSettings = makeMfaSettings({
			userId: new UniqueEntityId(userId),
			totpEnabled: true,
			totpSecret,
		});
		inMemoryMfaSettingsRepository.items.push(mfaSettings);

		const result = await sut.execute({ userId, totpCode });

		expect(isLeft(result)).toBeTruthy();
		expect(unwrapEither(result)).toBeInstanceOf(MfaAlreadyEnabledError);
	});

	it('should not be able to enable MFA if invalid totp code', async () => {
		const userId = new UniqueEntityId().toString();
		const totpSecret = "fake-secret-123";
		const totpCode = "123456";
		const invalidCode = "000000";
		
		const mfaSettings = makeMfaSettings({
			userId: new UniqueEntityId(userId),
			totpEnabled: false,
			totpSecret,
		});
		inMemoryMfaSettingsRepository.items.push(mfaSettings);

		fakeMfaService.setTotpVerificationResult(totpCode, totpSecret, true);
		fakeMfaService.setTotpVerificationResult(invalidCode, totpSecret, false);

		const result = await sut.execute({ userId, totpCode: invalidCode });

		expect(isLeft(result)).toBeTruthy();
		expect(unwrapEither(result)).toBeInstanceOf(InvalidTotpCodeError);
	});
})