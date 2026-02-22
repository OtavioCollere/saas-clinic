import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailQueue } from '@/shared/services/email/email-queue';
import { PatientCreatedEvent } from '@/domain/enterprise/events/patient-created.event';
import { PasswordVerificationRepository } from '@/domain/application/repositories/password-verification-repository';
import { UniqueEntityId } from '@/shared/entities/unique-entity-id';
import { randomUUID } from 'crypto';
import { PasswordVerification } from '@/domain/enterprise/entities/password-verification';

@Injectable()
export class OnPatientCreated {
  constructor(
    @Inject(EmailQueue)
    private readonly emailQueue: EmailQueue,
    @Inject(PasswordVerificationRepository)
    private readonly passwordVerificationRepository: PasswordVerificationRepository,
  ) {}

  private generateToken(): string {
    return randomUUID();
  }

  @OnEvent('patient.created')
  async handle(event: PatientCreatedEvent) {
    try {
      const token = this.generateToken();
      const url = `http://localhost:3005/${event.clinicSlug}/auth/change-password?token=${token}`;

      console.log('📧 [OnPatientCreated] ============================================');
      console.log('📧 [OnPatientCreated] Gerando link de senha para paciente:');
      console.log('📧 [OnPatientCreated] Patient ID:', event.patientId);
      console.log('📧 [OnPatientCreated] User ID:', event.userId);
      console.log('📧 [OnPatientCreated] Clinic Slug:', event.clinicSlug);
      console.log('📧 [OnPatientCreated] Email:', event.userEmail);
      console.log('📧 [OnPatientCreated] Token:', token);
      console.log('📧 [OnPatientCreated] 🔗 LINK DE SENHA:', url);
      console.log('📧 [OnPatientCreated] ============================================');

      const passwordVerification = PasswordVerification.create({
        token,
        userId: new UniqueEntityId(event.userId),
      });

      await this.passwordVerificationRepository.create(passwordVerification);

      console.log('📧 [OnPatientCreated] Password verification criado com sucesso');

      await this.emailQueue.enqueue({
        to: event.userEmail,
        subject: 'Bem vindo ao Cliniker',
        html: `
          <h1>Bem vindo ao Cliniker</h1>
          <p>Seu cadastro foi realizado com sucesso!</p>
          <p>Para definir sua senha de acesso, clique no botão abaixo:</p>
          <button style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
            <a href="${url}" style="color: white; text-decoration: none;">Definir minha senha</a>
          </button>
          <p>Ou copie e cole o link abaixo no seu navegador:</p>
          <p>${url}</p>
          <p><strong>Este link expira em 1 hora.</strong></p>
          <p>Se você não solicitou este cadastro, por favor, ignore este email.</p>
        `,
        text: `Bem vindo ao Cliniker\n\nSeu cadastro foi realizado com sucesso!\n\nPara definir sua senha de acesso, acesse o link abaixo:\n${url}\n\nEste link expira em 1 hora.\n\nSe você não solicitou este cadastro, por favor, ignore este email.`,
      });

      console.log('📧 [OnPatientCreated] ✅ Email enfileirado com sucesso para:', event.userEmail);
    } catch (error) {
      console.error('📧 [OnPatientCreated] ❌ Erro ao processar evento:', error);
      throw error;
    }
  }
}
