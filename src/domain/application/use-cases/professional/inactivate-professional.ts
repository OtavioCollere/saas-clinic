import { Inject, Injectable } from '@nestjs/common';
import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import { ProfessionalNotFoundError } from '@/shared/errors/professional-not-found-error';
import { ProfessionalHasPendingAppointmentsError } from '@/shared/errors/professional-has-pending-appointments-error';
import { UserIsNotOwnerError } from '@/shared/errors/user-is-not-owner-error';
import type { Professional } from '@/domain/enterprise/entities/professional';
import { ProfessionalRepository } from '../../repositories/professional-repository';
import { AppointmentsRepository } from '../../repositories/appointments-repository';
import { ClinicMembershipRepository } from '../../repositories/clinic-membership-repository';
import { FranchiseRepository } from '../../repositories/franchise-repository';

interface InactivateProfessionalUseCaseRequest {
  professionalId: string;
  userId: string;
}

type InactivateProfessionalUseCaseResponse = Either<
  ProfessionalNotFoundError | UserIsNotOwnerError | ProfessionalHasPendingAppointmentsError,
  { professional: Professional }
>;

@Injectable()
export class InactivateProfessionalUseCase {
  constructor(
    @Inject(ProfessionalRepository)
    private professionalRepository: ProfessionalRepository,
    @Inject(AppointmentsRepository)
    private appointmentsRepository: AppointmentsRepository,
    @Inject(ClinicMembershipRepository)
    private clinicMembershipRepository: ClinicMembershipRepository,
    @Inject(FranchiseRepository)
    private franchiseRepository: FranchiseRepository,
  ) {}

  async execute({
    professionalId,
    userId,
  }: InactivateProfessionalUseCaseRequest): Promise<InactivateProfessionalUseCaseResponse> {
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

    const pendingAppointments = await this.appointmentsRepository.findPendingByProfessionalId(professionalId);

    if (pendingAppointments.length > 0) {
      return makeLeft(new ProfessionalHasPendingAppointmentsError());
    }

    professional.status = professional.status.inactivate();
    professional.updatedAt = new Date();

    await this.professionalRepository.update(professional);

    return makeRight({ professional });
  }
}
