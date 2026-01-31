import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import { UniqueEntityId } from '@/shared/entities/unique-entity-id';
import { ClinicNotFoundError } from '@/shared/errors/clinic-not-found-error';
import { UserIsNotOwnerError } from '@/shared/errors/user-is-not-owner-error';
import { Franchise } from '@/domain/enterprise/entities/franchise';
import { FranchiseStatus } from '@/domain/enterprise/value-objects/franchise-status';
import type { ClinicMembershipRepository } from '../../repositories/clinic-membership-repository';
import type { ClinicRepository } from '../../repositories/clinic-repository';
import type { FranchiseRepository } from '../../repositories/franchise-repository';

interface RegisterFranchiseUseCaseRequest {
  clinicId: string;
  userId: string;
  name: string;
  address: string;
  zipCode: string;
  description?: string;
}

type RegisterFranchiseUseCaseResponse = Either<
  ClinicNotFoundError | UserIsNotOwnerError,
  {
    franchise: Franchise;
  }
>;

export class RegisterFranchiseUseCase {
  constructor(
    private clinicRepository: ClinicRepository,
    private franchiseRepository: FranchiseRepository,
    private clinicMembershipRepository: ClinicMembershipRepository
  ) {}

  async execute({
    clinicId,
    userId,
    name,
    address,
    zipCode,
    description,
  }: RegisterFranchiseUseCaseRequest): Promise<RegisterFranchiseUseCaseResponse> {
    const clinic = await this.clinicRepository.findById(clinicId);

    if (!clinic) {
      return makeLeft(new ClinicNotFoundError());
    }

    const clinicMembership = await this.clinicMembershipRepository.findByUserAndClinic(
      userId,
      clinicId
    );

    if (!clinicMembership || !clinicMembership.role.isOwner()) {
      return makeLeft(new UserIsNotOwnerError());
    }

    const franchise = Franchise.create({
      clinicId: new UniqueEntityId(clinicId),
      name,
      address,
      zipCode,
      status: FranchiseStatus.active(),
      description,
    });

    await this.franchiseRepository.create(franchise);

    return makeRight({ franchise });
  }
}