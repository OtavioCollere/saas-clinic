import { type Either, makeLeft, makeRight } from '@/core/either/either';
import { FranchiseNotFoundError } from '@/core/errors/franchise-not-found-error';
import { UserIsNotOwnerError } from '@/core/errors/user-is-not-owner-error';
import type { Franchise } from '@/domain/enterprise/entities/franchise';
import type { ClinicMembershipRepository } from '../../repositories/clinic-membership-repository';
import type { FranchiseRepository } from '../../repositories/franchise-repository';

interface EditFranchiseUseCaseRequest {
  franchiseId: string;
  userId: string;
  name?: string;
  address?: string;
  zipCode?: string;
  description?: string;
}

type EditFranchiseUseCaseResponse = Either<
  FranchiseNotFoundError | UserIsNotOwnerError,
  {
    franchise: Franchise;
  }
>;

export class EditFranchiseUseCase {
  constructor(
    private franchiseRepository: FranchiseRepository,
    private clinicMembershipRepository: ClinicMembershipRepository
  ) {}

  async execute({
    franchiseId,
    userId,
    name,
    address,
    zipCode,
    description,
  }: EditFranchiseUseCaseRequest): Promise<EditFranchiseUseCaseResponse> {
    const franchise = await this.franchiseRepository.findById(franchiseId);

    if (!franchise) {
      return makeLeft(new FranchiseNotFoundError());
    }

    const clinicMembership = await this.clinicMembershipRepository.findByUserAndClinic(
      userId,
      franchise.clinicId.toString()
    );

    if (!clinicMembership || !clinicMembership.role.isOwner()) {
      return makeLeft(new UserIsNotOwnerError());
    }

    if (name) franchise.name = name;
    if (address) franchise.address = address;
    if (zipCode) franchise.zipCode = zipCode;
    if (description !== undefined) franchise.description = description;

    franchise.updatedAt = new Date();

    await this.franchiseRepository.update(franchise);

    return makeRight({ franchise });
  }
}

