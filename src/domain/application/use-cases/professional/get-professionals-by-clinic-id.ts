import { Inject, Injectable } from '@nestjs/common';
import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import { ClinicNotFoundError } from '@/shared/errors/clinic-not-found-error';
import type { Professional } from '@/domain/enterprise/entities/professional';
import type { User } from '@/domain/enterprise/entities/user';
import { ClinicRepository } from '../../repositories/clinic-repository';
import { ProfessionalRepository } from '../../repositories/professional-repository';
import { UsersRepository } from '../../repositories/users-repository';

interface GetProfessionalsByClinicIdUseCaseRequest {
  clinicId: string;
}

type GetProfessionalsByClinicIdUseCaseResponse = Either<
  ClinicNotFoundError,
  {
    professionals: Professional[];
    users: Map<string, User>;
  }
>;

@Injectable()
export class GetProfessionalsByClinicIdUseCase {
  constructor(
    @Inject(ProfessionalRepository)
    private professionalRepository: ProfessionalRepository,
    @Inject(ClinicRepository)
    private clinicRepository: ClinicRepository,
    @Inject(UsersRepository)
    private usersRepository: UsersRepository
  ) {}

  async execute({
    clinicId,
  }: GetProfessionalsByClinicIdUseCaseRequest): Promise<GetProfessionalsByClinicIdUseCaseResponse> {
    const clinic = await this.clinicRepository.findById(clinicId);

    if (!clinic) {
      return makeLeft(new ClinicNotFoundError());
    }

    const professionals = await this.professionalRepository.findByClinicId(clinicId);
    
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

