import { beforeEach, describe, expect, it } from "vitest";
import { MfaVerifyLoginUseCase } from "../mfa-verify-login";
import { InMemoryMfaSettingsRepository } from "tests/in-memory-repositories/in-memory-mfa-settings-repository";
import { InMemorySessionsRepository } from "tests/in-memory-repositories/in-memory-sessions-repository";
import { FakeMfaService } from "tests/cryptography/fake-mfa-service";
import { FakeEncrypter } from "tests/cryptography/fake-encrypter";
import { isLeft, isRight, unwrapEither } from "@/shared/either/either";
import { MfaSettingsNotFoundError } from "@/shared/errors/mfa-settings-not-found-error";
import { InvalidTotpCodeError } from "@/shared/errors/invalid-totp-code-error";
import { makeMfaSettings } from "tests/factories/makeMfaSettings";
import { makeSession } from "tests/factories/makeSession";
import { UniqueEntityId } from "@/shared/entities/unique-entity-id";
import { SessionStatus } from "@/domain/enterprise/value-objects/session-status";
import { Session } from "@/domain/enterprise/entities/session";

describe('MfaVerifyLoginUseCase Unit Tests', () => {
	let sut: MfaVerifyLoginUseCase;
	let inMemoryMfaSettingsRepository: InMemoryMfaSettingsRepository;
	let inMemorySessionsRepository: InMemorySessionsRepository;
	let fakeMfaService: FakeMfaService;
	let fakeEncrypter: FakeEncrypter;

	beforeEach(() => {
		inMemoryMfaSettingsRepository = new InMemoryMfaSettingsRepository();
		inMemorySessionsRepository = new InMemorySessionsRepository();
		fakeMfaService = new FakeMfaService();
		fakeEncrypter = new FakeEncrypter();
		sut = new MfaVerifyLoginUseCase(
			inMemoryMfaSettingsRepository,
			fakeMfaService,
			inMemorySessionsRepository,
			fakeEncrypter
		);
	});

	it('should be able to verify login with MFA and create new session', async () => {
		const userId = new UniqueEntityId().toString();
		const totpSecret = "fake-secret-123";
		const totpCode = "123456";
		const sessionId = new UniqueEntityId().toString();
		const fingerprint = {
			ip: "127.0.0.1",
			userAgent: "test-agent",
		};

		const mfaSettings = makeMfaSettings({
			userId: new UniqueEntityId(userId),
			totpEnabled: true,
			totpSecret,
		});
		inMemoryMfaSettingsRepository.items.push(mfaSettings);

		fakeMfaService.setTotpVerificationResult(totpCode, totpSecret, true);

		const result = await sut.execute({
			userId,
			sessionId,
			totpCode,
			fingerprint,
		});

		expect(isRight(result)).toBeTruthy();
		if (isRight(result)) {
			const { access_token, refresh_token } = unwrapEither(result);
			expect(access_token).toBe('signed-token');
			expect(refresh_token).toBe('refresh-token');
			
			// Verifica se uma nova sessão foi criada para o usuário
			const sessions = await inMemorySessionsRepository.findByUserId(userId);
			expect(sessions.length).toBeGreaterThan(0);
			const session = sessions[0];
			expect(session).toBeTruthy();
			expect(session?.mfaVerified).toBe(true);
		}
	});

	it('should be able to verify login with MFA and revoke existing non-expired session', async () => {
		const userId = new UniqueEntityId().toString();
		const totpSecret = "fake-secret-123";
		const totpCode = "123456";
		const sessionId = new UniqueEntityId().toString();
		const fingerprint = {
			ip: "127.0.0.1",
			userAgent: "test-agent",
		};

		const mfaSettings = makeMfaSettings({
			userId: new UniqueEntityId(userId),
			totpEnabled: true,
			totpSecret,
		});
		inMemoryMfaSettingsRepository.items.push(mfaSettings);

		const existingSession = Session.create({
			userId: new UniqueEntityId(userId),
			status: SessionStatus.PENDING,
			mfaVerified: false,
			fingerprint,
			expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour from now (not expired)
		}, new UniqueEntityId(sessionId));
		inMemorySessionsRepository.items.push(existingSession);

		fakeMfaService.setTotpVerificationResult(totpCode, totpSecret, true);

		const result = await sut.execute({
			userId,
			sessionId,
			totpCode,
			fingerprint,
		});

		expect(isRight(result)).toBeTruthy();
		if (isRight(result)) {
			const { access_token, refresh_token } = unwrapEither(result);
			expect(access_token).toBe('signed-token');
			expect(refresh_token).toBe('refresh-token');
			
			const session = await inMemorySessionsRepository.findById(sessionId);
			expect(session).toBeTruthy();
			expect(session?.status).toBe(SessionStatus.REVOKED);
		}
	});

	it('should not be able to verify login if MFA settings not found', async () => {
		const userId = new UniqueEntityId().toString();
		const totpCode = "123456";
		const sessionId = new UniqueEntityId().toString();
		const fingerprint = {
			ip: "127.0.0.1",
			userAgent: "test-agent",
		};

		const result = await sut.execute({
			userId,
			sessionId,
			totpCode,
			fingerprint,
		});

		expect(isLeft(result)).toBeTruthy();
		expect(unwrapEither(result)).toBeInstanceOf(MfaSettingsNotFoundError);
	});

	it('should not be able to verify login if invalid totp code', async () => {
		const userId = new UniqueEntityId().toString();
		const totpSecret = "fake-secret-123";
		const totpCode = "123456";
		const invalidCode = "000000";
		const sessionId = new UniqueEntityId().toString();
		const fingerprint = {
			ip: "127.0.0.1",
			userAgent: "test-agent",
		};

		const mfaSettings = makeMfaSettings({
			userId: new UniqueEntityId(userId),
			totpEnabled: true,
			totpSecret,
		});
		inMemoryMfaSettingsRepository.items.push(mfaSettings);

		fakeMfaService.setTotpVerificationResult(totpCode, totpSecret, true);
		fakeMfaService.setTotpVerificationResult(invalidCode, totpSecret, false);

		const result = await sut.execute({
			userId,
			sessionId,
			totpCode: invalidCode,
			fingerprint,
		});

		expect(isLeft(result)).toBeTruthy();
		expect(unwrapEither(result)).toBeInstanceOf(InvalidTotpCodeError);
	});
})