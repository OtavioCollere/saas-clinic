import { Inject, Injectable } from '@nestjs/common';
import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import { ProfessionalNotFoundError } from '@/shared/errors/professional-not-found-error';
import type { Professional } from '@/domain/enterprise/entities/professional';
import type { User } from '@/domain/enterprise/entities/user';
import { ProfessionalRepository } from '../../repositories/professional-repository';
import { UsersRepository } from '../../repositories/users-repository';

interface GetProfessionalUseCaseRequest {
  professionalId: string;
}

type GetProfessionalUseCaseResponse = Either<
  ProfessionalNotFoundError,
  { professional: Professional; user: User | null }
>;

@Injectable()
export class GetProfessionalUseCase {
  constructor(
    @Inject(ProfessionalRepository)
    private professionalRepository: ProfessionalRepository,
    @Inject(UsersRepository)
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    professionalId,
  }: GetProfessionalUseCaseRequest): Promise<GetProfessionalUseCaseResponse> {
    const professional = await this.professionalRepository.findById(professionalId);

    if (!professional) {
      return makeLeft(new ProfessionalNotFoundError());
    }

    const user = await this.usersRepository.findById(professional.userId.toString());

    return makeRight({ professional, user });
  }
}
