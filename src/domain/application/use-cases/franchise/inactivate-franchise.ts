import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import { FranchiseHasPendingAppointmentsError } from '@/shared/errors/franchise-has-pending-appointments-error';
import { FranchiseNotFoundError } from '@/shared/errors/franchise-not-found-error';
import { UserIsNotOwnerError } from '@/shared/errors/user-is-not-owner-error';
import type { Franchise } from '@/domain/enterprise/entities/franchise';
import type { AppointmentsRepository } from '../../repositories/appointments-repository';
import type { ClinicMembershipRepository } from '../../repositories/clinic-membership-repository';
import type { FranchiseRepository } from '../../repositories/franchise-repository';

interface InactivateFranchiseUseCaseRequest {
  franchiseId: string;
  userId: string;
}

type InactivateFranchiseUseCaseResponse = Either<
  FranchiseNotFoundError | UserIsNotOwnerError | FranchiseHasPendingAppointmentsError,
  {
    franchise: Franchise;
  }
>;

export class InactivateFranchiseUseCase {
  constructor(
    private franchiseRepository: FranchiseRepository,
    private appointmentsRepository: AppointmentsRepository,
    private clinicMembershipRepository: ClinicMembershipRepository
  ) {}

  async execute({
    franchiseId,
    userId,
  }: InactivateFranchiseUseCaseRequest): Promise<InactivateFranchiseUseCaseResponse> {
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

    const pendingAppointments = await this.appointmentsRepository.findPendingByFranchiseId(franchiseId);

    if (pendingAppointments.length > 0) {
      return makeLeft(new FranchiseHasPendingAppointmentsError());
    }

    franchise.status = franchise.status.inactivate();
    franchise.updatedAt = new Date();

    await this.franchiseRepository.update(franchise);

    return makeRight({ franchise });
  }
}

