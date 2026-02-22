import { Inject, Injectable } from "@nestjs/common";
import { makeLeft, makeRight, type Either } from "@/shared/either/either";
import { PasswordVerificationRepository } from "../../repositories/password-verification-repository";
import { UsersRepository } from "../../repositories/users-repository";
import { HashGenerator } from "../../cryptography/hash-generator";
import type { User } from "@/domain/enterprise/entities/user";
import { UserNotFoundError } from "@/shared/errors/user-not-found-error";
import { PasswordVerificationNotFoundError } from "@/shared/errors/password-verification-not-found-error";
import { PasswordTokenExpiredError } from "@/shared/errors/password-token-expired-error";

export interface ChangePasswordUseCaseRequest {
  password: string;
  token: string;
}

type ChangePasswordUseCaseResponse = Either<
  PasswordVerificationNotFoundError | PasswordTokenExpiredError | UserNotFoundError,
  {
    user: User;
  }
>;

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    @Inject(PasswordVerificationRepository)
    private readonly passwordVerificationRepository: PasswordVerificationRepository,
    @Inject(UsersRepository)
    private readonly usersRepository: UsersRepository,
    @Inject(HashGenerator)
    private readonly hashGenerator: HashGenerator
  ) {}

  async execute({ password, token }: ChangePasswordUseCaseRequest): Promise<ChangePasswordUseCaseResponse> {
    const passwordVerification = await this.passwordVerificationRepository.findByToken(token);

    if (!passwordVerification) {
      return makeLeft(new PasswordVerificationNotFoundError());
    }

    if (passwordVerification.isTokenExpired()) {
      return makeLeft(new PasswordTokenExpiredError());
    }

    if (passwordVerification.isTokenUsed()) {
      return makeLeft(new PasswordTokenExpiredError());
    }

    const user = await this.usersRepository.findById(passwordVerification.userId.toString());

    if (!user) {
      return makeLeft(new UserNotFoundError());
    }

    const hashedPassword = await this.hashGenerator.hash(password);
    user.password = hashedPassword;
    user.isEmailVerified = true;

    await this.usersRepository.save(user);

    // Marca o token como usado
    passwordVerification.markAsUsed();
    await this.passwordVerificationRepository.update(passwordVerification);

    return makeRight({ user });
  }
}