import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailQueue } from '@/shared/services/email/email-queue';
import { ProfessionalCreatedEvent } from '@/domain/enterprise/events/professional-created.event';
import { PasswordVerificationRepository } from '@/domain/application/repositories/password-verification-repository';
import { UniqueEntityId } from '@/shared/entities/unique-entity-id';
import { randomUUID } from 'crypto';
import { PasswordVerification } from '@/domain/enterprise/entities/password-verification';

@Injectable()
export class OnProfessionalCreated {
  constructor(
    @Inject(EmailQueue)
    private readonly emailQueue: EmailQueue,
    @Inject(PasswordVerificationRepository)
    private readonly passwordVerificationRepository: PasswordVerificationRepository,
  ) {}

  private generateToken(): string {
    return randomUUID();
  }

  @OnEvent('professional.created')
  async handle(event: ProfessionalCreatedEvent) {
    try {
      const token = this.generateToken();
      const url = `http://localhost:3005/${event.clinicSlug}/auth/change-password?token=${token}`;

      console.log('📧 [OnProfessionalCreated] ============================================');
      console.log('📧 [OnProfessionalCreated] Gerando link de senha para profissional:');
      console.log('📧 [OnProfessionalCreated] Professional ID:', event.professionalId);
      console.log('📧 [OnProfessionalCreated] User ID:', event.userId);
      console.log('📧 [OnProfessionalCreated] Clinic Slug:', event.clinicSlug);
      console.log('📧 [OnProfessionalCreated] Email:', event.userEmail);
      console.log('📧 [OnProfessionalCreated] Token:', token);
      console.log('📧 [OnProfessionalCreated] 🔗 LINK DE SENHA:', url);
      console.log('📧 [OnProfessionalCreated] ============================================');

      const passwordVerification = PasswordVerification.create({
        token,
        userId: new UniqueEntityId(event.userId),
      });

      await this.passwordVerificationRepository.create(passwordVerification);

      console.log('📧 [OnProfessionalCreated] Password verification criado com sucesso');

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

      console.log('📧 [OnProfessionalCreated] ✅ Email enfileirado com sucesso para:', event.userEmail);
    } catch (error) {
      console.error('📧 [OnProfessionalCreated] ❌ Erro ao processar evento:', error);
      throw error;
    }
  }
}
