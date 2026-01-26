import { Either, makeLeft, makeRight } from "@/core/either/either";
import { WrongCredentialsError } from "@/core/errors/wrong-credentials-error";
import { UsersRepository } from "../../repositories/users-repository";
import { HashComparer } from "../../cryptography/hash-comparer";
import { Encrypter } from "../../cryptography/encrypter";
import type { SessionsRepository } from "../../repositories/sessions-repository";
import { Session } from "@/domain/enterprise/entities/session";
import type { MfaSettingsRepository } from "../../repositories/mfa-settings-repository";
import { SessionStatus } from "@/domain/enterprise/value-objects/session-status";

interface AuthenticateUserUseCaseRequest {
  email: string;
  password: string;
  fingerprint: {
    ip: string;
    userAgent: string;
  };
}

type AuthenticateUserUseCaseResponse = Either<
  WrongCredentialsError,
  | {
      refresh_token: string;
      access_token: string;
    }
  | {
      session_id: string;
      mfa_required: boolean;
    }
>;

export class AuthenticateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
    private sessionsRepository: SessionsRepository,
    private mfaSettingsRepository: MfaSettingsRepository,
  ) {}

  async execute({
    email,
    password,
    fingerprint,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return makeLeft(new WrongCredentialsError());
    }

    const doesPasswordMatches = await this.hashComparer.compare(
      password,
      user.password,
    );

    if (!doesPasswordMatches) {
      return makeLeft(new WrongCredentialsError());
    }

    const activeSessions = await this.sessionsRepository.findActiveByUserId(
      user.id.toString(),
    );

    let session: Session | null = null;

    // 1️⃣ Reutiliza sessão se fingerprint for igual
    for (const existingSession of activeSessions) {
      if (
        existingSession.fingerprint.ip === fingerprint.ip &&
        existingSession.fingerprint.userAgent === fingerprint.userAgent
      ) {
        session = existingSession;
        break;
      }
    }

    // 2️⃣ Se encontrou sessão com fingerprint diferente, revoga todas
    if (!session && activeSessions.length > 0) {
      for (const existingSession of activeSessions) {
        existingSession.revokeSession();
        await this.sessionsRepository.create(existingSession);
      }
    }

    // 3️⃣ Cria nova sessão se não reaproveitou
    if (!session) {
      session = Session.create({
        userId: user.id,
        fingerprint,
        mfaVerified: false,
        status: SessionStatus.PENDING,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      });

      await this.sessionsRepository.create(session);
    }

    // 4️⃣ Verifica MFA
    const mfaSettings = await this.mfaSettingsRepository.findByUserId(
      user.id.toString(),
    );

    if (mfaSettings?.totpEnabled) {
      return makeRight({
        session_id: session.id.toString(),
        mfa_required: true,
      });
    }

    // 5️⃣ Ativa sessão e gera tokens
    session.activeSession();
    await this.sessionsRepository.create(session);

    const accessToken = await this.encrypter.sign({
      userId: user.id.toString(),
      sessionId: session.id.toString(),
    });

    const refreshToken = await this.encrypter.refresh({
      userId: user.id.toString(),
      sessionId: session.id.toString(),
    });

    return makeRight({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }
}
