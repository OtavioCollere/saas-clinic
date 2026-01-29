import { Inject, Injectable } from "@nestjs/common";
import { Either, makeLeft, makeRight } from "@/core/either/either";
import { WrongCredentialsError } from "@/core/errors/wrong-credentials-error";
import { UsersRepository } from "../../repositories/users-repository";
import { HashComparer } from "../../cryptography/hash-comparer";
import { Encrypter } from "../../cryptography/encrypter";
import { SessionsRepository } from "../../repositories/sessions-repository";
import { Session } from "@/domain/enterprise/entities/session";
import { MfaSettingsRepository } from "../../repositories/mfa-settings-repository";
import { SessionStatus } from "@/domain/enterprise/value-objects/session-status";

interface AuthenticateUserUseCaseRequest{
    email: string;
    password: string;
    fingerprint: {
        ip: string;
        userAgent: string;
    }
}

type AuthenticateUserSuccess =
  | {
      type: 'authenticated';
      access_token: string
      refresh_token: string
    }
  | {
      type: 'mfa_required';
      mfa_required: boolean;
      session_id: string
    }

type AuthenticateUserUseCaseResponse = Either<
  WrongCredentialsError,
  AuthenticateUserSuccess
>

@Injectable()
export class AuthenticateUserUseCase {
    constructor(
      @Inject(UsersRepository)
      private usersRepository: UsersRepository,
      @Inject(HashComparer)
      private hashComparer: HashComparer,
      @Inject(Encrypter)
      private encrypter: Encrypter,
      @Inject(SessionsRepository)
      private sessionsRepository: SessionsRepository,
      @Inject(MfaSettingsRepository)
      private mfaSettingsRepository: MfaSettingsRepository,
    ) {}
  
    async execute({
      email,
      password,
      fingerprint,
    }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
  
      const user = await this.usersRepository.findByEmail(email)

      if (!user) {
        return makeLeft(new WrongCredentialsError())
      }
  
      const passwordMatches = await this.hashComparer.compare(
        password,
        user.password,
      )
  
      if (!passwordMatches) {
        return makeLeft(new WrongCredentialsError())
      }
  
      // 1️⃣ Verifica sessão ativa existente
      const activeSession = await this.sessionsRepository.findActiveByUserId(
        user.id.toString(),
      )
  
      if (activeSession.length > 0) {
        const tokens = await this.issueTokens(user.id.toString())
        return makeRight({
          type: 'authenticated',
          ...tokens
        })
      }
  
      // 2️⃣ Cria nova sessão
      const session = Session.create({
        userId: user.id,
        fingerprint,
        mfaVerified: false,
        status: SessionStatus.PENDING,
      })
  
      const mfaSettings = await this.mfaSettingsRepository.findByUserId(
        user.id.toString(),
      )
  
      // 3️⃣ MFA governa ativação
      if (mfaSettings?.totpEnabled) {
        await this.sessionsRepository.create(session)
  
        return makeRight({
          type: 'mfa_required',
          session_id: session.id.toString(),
          mfa_required: true,
        })
      }
  
      // 4️⃣ Sem MFA → ativa sessão e emite tokens
      session.activateSession()
      await this.sessionsRepository.create(session)

      const tokens = await this.issueTokens(user.id.toString())

      return makeRight({
        type: 'authenticated',
        ...tokens
      })
    }
  
    private async issueTokens(userId: string) {
      const access_token = await this.encrypter.sign({ userId })
      const refresh_token = await this.encrypter.refresh({ userId })

      return { access_token, refresh_token }
    }
  }
  