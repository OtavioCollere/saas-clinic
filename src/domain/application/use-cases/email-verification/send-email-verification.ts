import { makeLeft, makeRight } from '@/core/either/either';
import { UsersRepository } from '../../repositories/users-repository';
import { UserNotFoundError } from '@/core/errors/user-not-found-error';
import { EmailService } from '@/core/services/email.service';
import { Injectable } from '@nestjs/common';
import { EmailVerificationRepository } from '../../repositories/email-verification-repository';
import { EmailVerification } from '@/domain/enterprise/entities/email-verification';
import crypto from 'crypto';

export interface SendEmailVerificationUseCaseRequest {
  userId: string;
}

@Injectable()
export class SendEmailVerificationUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private emailService: EmailService,
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
      // opcional, mas recomendado
      await this.emailVerificationRepository.deleteAllByUserId(
        user.id.toString(),
        tx,
      );

      await this.emailVerificationRepository.create(emailVerification, tx);
    });

    await this.emailService.sendEmailVerification({
      to: user.email.getValue(),
      token,
    });

    return makeRight({
      message : 'If you have an account with this email, you will receive an email to verify your account.',
    });
  }
}
