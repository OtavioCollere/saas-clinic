import { Inject, Injectable } from '@nestjs/common';
import { Either, makeLeft, makeRight } from '@/shared/either/either';
import { ClinicNotFoundError } from '@/shared/errors/clinic-not-found-error';
import type { User } from '@/domain/enterprise/entities/user';
import { ClinicRepository } from '../../repositories/clinic-repository';
import { ClinicMembershipRepository } from '../../repositories/clinic-membership-repository';
import { UsersRepository } from '../../repositories/users-repository';

interface GetUsersByClinicIdUseCaseRequest {
  clinicId: string;
}

type GetUsersByClinicIdUseCaseResponse = Either<
  ClinicNotFoundError,
  {
    users: User[];
  }
>;

@Injectable()
export class GetUsersByClinicIdUseCase {
  constructor(
    @Inject(ClinicRepository)
    private clinicRepository: ClinicRepository,
    @Inject(ClinicMembershipRepository)
    private clinicMembershipRepository: ClinicMembershipRepository,
    @Inject(UsersRepository)
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    clinicId,
  }: GetUsersByClinicIdUseCaseRequest): Promise<GetUsersByClinicIdUseCaseResponse> {
    const clinic = await this.clinicRepository.findById(clinicId);

    if (!clinic) {
      return makeLeft(new ClinicNotFoundError());
    }

    const memberships = await this.clinicMembershipRepository.findByClinicId(clinicId);

    const userIds = memberships.map((membership) => membership.userId.toString());

    const users = await Promise.all(
      userIds.map((userId) => this.usersRepository.findById(userId))
    );

    const validUsers = users.filter((user): user is User => user !== null);

    return makeRight({ users: validUsers });
  }
}

