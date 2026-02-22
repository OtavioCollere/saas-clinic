import { Inject, Injectable } from "@nestjs/common";
import { Either, makeLeft, makeRight } from "@/shared/either/either";
import { WrongCredentialsError } from "@/shared/errors/wrong-credentials-error";
import { ClinicMembershipNotFoundError } from "@/shared/errors/clinic-membership-not-found-error";
import { UsersRepository } from "../../repositories/users-repository";
import { HashComparer } from "../../cryptography/hash-comparer";
import { Encrypter } from "../../cryptography/encrypter";
import { SessionsRepository } from "../../repositories/sessions-repository";
import { Session } from "@/domain/enterprise/entities/session";
import { MfaSettingsRepository } from "../../repositories/mfa-settings-repository";
import { SessionStatus } from "@/domain/enterprise/value-objects/session-status";
import { ClinicMembershipRepository } from "../../repositories/clinic-membership-repository";
import { ClinicNotFoundError } from "@/shared/errors/clinic-not-found-error";
import { ClinicRepository } from "../../repositories/clinic-repository";

interface AuthenticateUserUseCaseRequest{
    email: string;
    password: string;
    fingerprint: {
        ip: string;
        userAgent: string;
    },
    clinicSlug : string
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
  WrongCredentialsError | ClinicNotFoundError | ClinicMembershipNotFoundError,
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
      @Inject(ClinicMembershipRepository)
      private clinicMembershipRepository: ClinicMembershipRepository,
      @Inject(ClinicRepository)
      private clinicRepository: ClinicRepository,
    ) {}
  
    async execute({
      email,
      password,
      fingerprint,
      clinicSlug,
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

      const clinic = await this.clinicRepository.findBySlug(clinicSlug);

      if (!clinic) {
        return makeLeft(new ClinicNotFoundError());
      }
  
      // 1️⃣ Verifica membership na clínica
      const clinicMembership = await this.getClinicMembership(user.id.toString(), clinic.id.toString());

      if (!clinicMembership) {
        return makeLeft(new ClinicMembershipNotFoundError());
      }

      // 2️⃣ Verifica sessão ativa existente
      const activeSession = await this.sessionsRepository.findActiveByUserId(
        user.id.toString(),
      )
  
      if (activeSession.length > 0) {
        const tokens = await this.issueTokens(
          user.id.toString(),
          clinic.id.toString(),
          clinicMembership.id.toString()
        );
        return makeRight({
          type: 'authenticated',
          ...tokens
        });
      }
  
      // 3️⃣ Cria nova sessão
      const session = Session.create({
        userId: user.id,
        fingerprint,
        mfaVerified: false,
        status: SessionStatus.PENDING,
      })
  
      const mfaSettings = await this.mfaSettingsRepository.findByUserId(
        user.id.toString(),
      )
  
      // 4️⃣ MFA governa ativação
      if (mfaSettings?.totpEnabled) {
        await this.sessionsRepository.create(session)
  
        return makeRight({
          type: 'mfa_required',
          session_id: session.id.toString(),
          mfa_required: true,
        })
      }
  
      // 5️⃣ Sem MFA → ativa sessão e emite tokens
      session.activateSession()
      await this.sessionsRepository.create(session)

      const tokens = await this.issueTokens(
        user.id.toString(),
        clinic.id.toString(),
        clinicMembership.id.toString()
      )

      return makeRight({
        type: 'authenticated',
        ...tokens
      })
    }
  
    private async issueTokens(userId: string, clinicId: string, clinicMembershipId: string) {
      const access_token = await this.encrypter.sign({ userId, clinicId, clinicMembershipId })
      const refresh_token = await this.encrypter.refresh({ userId, clinicId, clinicMembershipId })

      return { access_token, refresh_token }
    }

    private async getClinicMembership(userId : string, clinicId : string){
      const clinicMembership = await this.clinicMembershipRepository.findByUserAndClinic(userId, clinicId);

      return clinicMembership;
    }
  }
  