import { Inject, Injectable } from '@nestjs/common';
import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import { ProfessionalNotFoundError } from '@/shared/errors/professional-not-found-error';
import { UserIsNotOwnerError } from '@/shared/errors/user-is-not-owner-error';
import type { Professional } from '@/domain/enterprise/entities/professional';
import { ProfessionalRepository } from '../../repositories/professional-repository';
import { ClinicMembershipRepository } from '../../repositories/clinic-membership-repository';
import { FranchiseRepository } from '../../repositories/franchise-repository';

interface ActivateProfessionalUseCaseRequest {
  professionalId: string;
  userId: string;
}

type ActivateProfessionalUseCaseResponse = Either<
  ProfessionalNotFoundError | UserIsNotOwnerError,
  { professional: Professional }
>;

@Injectable()
export class ActivateProfessionalUseCase {
  constructor(
    @Inject(ProfessionalRepository)
    private professionalRepository: ProfessionalRepository,
    @Inject(ClinicMembershipRepository)
    private clinicMembershipRepository: ClinicMembershipRepository,
    @Inject(FranchiseRepository)
    private franchiseRepository: FranchiseRepository,
  ) {}

  async execute({
    professionalId,
    userId,
  }: ActivateProfessionalUseCaseRequest): Promise<ActivateProfessionalUseCaseResponse> {
    const professional = await this.professionalRepository.findById(professionalId);

    if (!professional) {
      return makeLeft(new ProfessionalNotFoundError());
    }

    const franchise = await this.franchiseRepository.findById(professional.franchiseId.toString());

    if (!franchise) {
      return makeLeft(new ProfessionalNotFoundError());
    }

    const clinicMembership = await this.clinicMembershipRepository.findByUserAndClinic(
      userId,
      franchise.clinicId.toString(),
    );

    if (!clinicMembership || !clinicMembership.role.isOwner()) {
      return makeLeft(new UserIsNotOwnerError());
    }

    professional.status = professional.status.activate();
    professional.updatedAt = new Date();

    await this.professionalRepository.update(professional);

    return makeRight({ professional });
  }
}
