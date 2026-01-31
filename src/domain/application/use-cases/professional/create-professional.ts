import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import { UniqueEntityId } from '@/shared/entities/unique-entity-id';
import { FranchiseNotFoundError } from '@/shared/errors/franchise-not-found-error';
import { ProfessionalAlreadyExistsError } from '@/shared/errors/professional-already-exists-error';
import { UserIsNotOwnerError } from '@/shared/errors/user-is-not-owner-error';
import { UserNotFoundError } from '@/shared/errors/user-not-found-error';
import { Professional } from '@/domain/enterprise/entities/professional';
import { Council } from '@/domain/enterprise/value-objects/council';
import { Profession } from '@/domain/enterprise/value-objects/profession';
import type { ClinicMembershipRepository } from '../../repositories/clinic-membership-repository';
import type { FranchiseRepository } from '../../repositories/franchise-repository';
import type { ProfessionalRepository } from '../../repositories/professional-repository';
import type { UsersRepository } from '../../repositories/users-repository';

interface CreateProfessionalUseCaseRequest {
  franchiseId: string;
  userId: string;
  ownerId: string;
  council: string;
  councilNumber: string;
  councilState: string;
  profession: string;
}

type CreateProfessionalUseCaseResponse = Either<
  UserNotFoundError | FranchiseNotFoundError | ProfessionalAlreadyExistsError | UserIsNotOwnerError,
  {
    professional: Professional;
  }
>;

export class CreateProfessionalUseCase {
  constructor(
    private professionalRepository: ProfessionalRepository,
    private franchiseRepository: FranchiseRepository,
    private usersRepository: UsersRepository,
    private clinicMembershipRepository: ClinicMembershipRepository
  ) {}

  async execute({
    franchiseId,
    userId,
    ownerId,
    council,
    councilNumber,
    councilState,
    profession,
  }: CreateProfessionalUseCaseRequest): Promise<CreateProfessionalUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return makeLeft(new UserNotFoundError());
    }

    const franchise = await this.franchiseRepository.findById(franchiseId);

    if (!franchise) {
      return makeLeft(new FranchiseNotFoundError());
    }

    const clinicMembership = await this.clinicMembershipRepository.findByUserAndClinic(
      ownerId,
      franchise.clinicId.toString()
    );

    if (!clinicMembership || !clinicMembership.role.isOwner()) {
      return makeLeft(new UserIsNotOwnerError());
    }

    const existingProfessional = await this.professionalRepository.findByUserIdAndFranchiseId(
      userId,
      franchiseId
    );

    if (existingProfessional) {
      return makeLeft(new ProfessionalAlreadyExistsError());
    }

    const councilVO = council === 'CRM' ? Council.crm() : Council.crbm();
    const professionVO = profession === 'MEDICO' ? Profession.medico() : Profession.biomedico();

    const professional = Professional.create({
      franchiseId: new UniqueEntityId(franchiseId),
      userId: new UniqueEntityId(userId),
      council: councilVO,
      councilNumber,
      councilState,
      profession: professionVO,
    });

    await this.professionalRepository.create(professional);

    return makeRight({ professional });
  }
}