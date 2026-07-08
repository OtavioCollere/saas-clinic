import { Inject, Injectable } from '@nestjs/common';
import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import { FranchiseNotFoundError } from '@/shared/errors/franchise-not-found-error';
import type { Professional } from '@/domain/enterprise/entities/professional';
import type { User } from '@/domain/enterprise/entities/user';
import { FranchiseRepository } from '../../repositories/franchise-repository';
import { ProfessionalRepository } from '../../repositories/professional-repository';
import { UsersRepository } from '../../repositories/users-repository';

interface GetProfessionalsByFranchiseIdUseCaseRequest {
  franchiseId: string;
}

type GetProfessionalsByFranchiseIdUseCaseResponse = Either<
  FranchiseNotFoundError,
  {
    professionals: Professional[];
    users: Map<string, User>;
  }
>;

@Injectable()
export class GetProfessionalsByFranchiseIdUseCase {
  constructor(
    @Inject(ProfessionalRepository)
    private professionalRepository: ProfessionalRepository,
    @Inject(FranchiseRepository)
    private franchiseRepository: FranchiseRepository,
    @Inject(UsersRepository)
    private usersRepository: UsersRepository
  ) {}

  async execute({
    franchiseId,
  }: GetProfessionalsByFranchiseIdUseCaseRequest): Promise<GetProfessionalsByFranchiseIdUseCaseResponse> {
    const franchise = await this.franchiseRepository.findById(franchiseId);

    if (!franchise) {
      return makeLeft(new FranchiseNotFoundError());
    }

    const professionals = await this.professionalRepository.findByFranchiseId(franchiseId);

    // Busca os usuários associados aos profissionais
    const userIds = [...new Set(professionals.map((p) => p.userId.toString()))];
    const users = await Promise.all(
      userIds.map((userId) => this.usersRepository.findById(userId))
    );

    const usersMap = new Map<string, User>();
    users.forEach((user) => {
      if (user) {
        usersMap.set(user.id.toString(), user);
      }
    });

    return makeRight({ professionals, users: usersMap });
  }
}
