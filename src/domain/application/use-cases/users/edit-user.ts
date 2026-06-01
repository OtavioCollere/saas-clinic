import { Inject, Injectable } from '@nestjs/common';
import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import { UserNotFoundError } from '@/shared/errors/user-not-found-error';
import { UsersRepository } from '../../repositories/users-repository';
import { Email } from '@/domain/enterprise/value-objects/email';
import type { User } from '@/domain/enterprise/entities/user';

interface EditUserUseCaseRequest {
  userId: string;
  name?: string;
  email?: string;
}

type EditUserUseCaseResponse = Either<UserNotFoundError, { user: User }>;

@Injectable()
export class EditUserUseCase {
  constructor(
    @Inject(UsersRepository)
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute({ userId, name, email }: EditUserUseCaseRequest): Promise<EditUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return makeLeft(new UserNotFoundError());
    }

    if (name) user.name = name;
    if (email) user.email = Email.create(email);

    await this.usersRepository.save(user);

    return makeRight({ user });
  }
}
