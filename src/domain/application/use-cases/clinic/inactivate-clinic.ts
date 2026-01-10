import { type Either, makeLeft, makeRight } from '@/core/either/either';
import { ClinicHasPendingAppointmentsError } from '@/core/errors/clinic-has-pending-appointments-error';
import { ClinicNotFoundError } from '@/core/errors/clinic-not-found-error';
import { UserIsNotOwnerError } from '@/core/errors/user-is-not-owner-error';
import type { Clinic } from '@/domain/enterprise/entities/clinic';
import type { AppointmentsRepository } from '../../repositories/appointments-repository';
import type { ClinicMembershipRepository } from '../../repositories/clinic-membership-repository';
import type { ClinicRepository } from '../../repositories/clinic-repository';

interface InactivateClinicUseCaseRequest {
  clinicId: string;
  userId: string;
}

type InactivateClinicUseCaseResponse = Either<
  ClinicNotFoundError | UserIsNotOwnerError | ClinicHasPendingAppointmentsError,
  {
    clinic: Clinic;
  }
>;

export class InactivateClinicUseCase {
  constructor(
    private clinicRepository: ClinicRepository,
    private appointmentsRepository: AppointmentsRepository,
    private clinicMembershipRepository: ClinicMembershipRepository
  ) {}

  async execute({
    clinicId,
    userId,
  }: InactivateClinicUseCaseRequest): Promise<InactivateClinicUseCaseResponse> {
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

    const pendingAppointments = await this.appointmentsRepository.findPendingByClinicId(clinicId);

    if (pendingAppointments.length > 0) {
      return makeLeft(new ClinicHasPendingAppointmentsError());
    }

    clinic.status = clinic.status.inactivate();
    clinic.updatedAt = new Date();

    await this.clinicRepository.update(clinic);

    return makeRight({ clinic });
  }
}
