import { makeLeft, makeRight } from '@/shared/either/either';
import { UsersRepository } from '../../repositories/users-repository';
import { UserNotFoundError } from '@/shared/errors/user-not-found-error';
import { EmailQueue } from '@/shared/services/email/email-queue';
import { Inject, Injectable } from '@nestjs/common';
import { EmailVerificationRepository } from '../../repositories/email-verification-repository';
import { EmailVerification } from '@/domain/enterprise/entities/email-verification';
import crypto from 'crypto';

export interface SendEmailVerificationUseCaseRequest {
  userId: string;
}

@Injectable()
export class SendEmailVerificationUseCase {
  constructor(
    @Inject(UsersRepository)
    private usersRepository: UsersRepository,
    @Inject(EmailQueue)
    private emailQueue: EmailQueue,
    @Inject(EmailVerificationRepository)
    private emailVerificationRepository: EmailVerificationRepository,
  ) {}

  async execute({ userId }: SendEmailVerificationUseCaseRequest) {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return makeLeft(new UserNotFoundError());
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

    const emailVerification = EmailVerification.create({
      userId: user.id,
      email: user.email,
      token,
      expiresAt,
    });

    await this.emailVerificationRepository.transaction(async (tx) => {
      await this.emailVerificationRepository.deleteAllByUserId(
        user.id.toString(),
        tx,
      );

      await this.emailVerificationRepository.create(emailVerification, tx);
    });

    const verificationUrl = `'http://localhost:3000'/verify-email?token=${token}`;
    
    await this.emailQueue.enqueue({
      to: user.email.getValue(),
      subject: 'Verify your email',
      html: `
        <h1>Email Verification</h1>
        <p>Click the link below to verify your email:</p>
        <a href="${verificationUrl}">Verify  </p>
      `,
      text: `Verify your email by clicking this link: ${verificationUrl}`,
    });

    return makeRight({
      message : 'If you have an account with this email, you will receive an email to verify your account.',
    });
  }
}
