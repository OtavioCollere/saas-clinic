import { type Either } from '@/core/either/either';
import { FranchiseHasPendingAppointmentsError } from '@/core/errors/franchise-has-pending-appointments-error';
import { FranchiseNotFoundError } from '@/core/errors/franchise-not-found-error';
import { UserIsNotOwnerError } from '@/core/errors/user-is-not-owner-error';
import type { Franchise } from '@/domain/enterprise/entities/franchise';
import type { AppointmentsRepository } from '../../repositories/appointments-repository';
import type { ClinicMembershipRepository } from '../../repositories/clinic-membership-repository';
import type { FranchiseRepository } from '../../repositories/franchise-repository';
interface ActivateFranchiseUseCaseRequest {
    franchiseId: string;
    userId: string;
}
type ActivateFranchiseUseCaseResponse = Either<FranchiseNotFoundError | UserIsNotOwnerError | FranchiseHasPendingAppointmentsError, {
    franchise: Franchise;
}>;
export declare class ActivateFranchiseUseCase {
    private franchiseRepository;
    private appointmentsRepository;
    private clinicMembershipRepository;
    constructor(franchiseRepository: FranchiseRepository, appointmentsRepository: AppointmentsRepository, clinicMembershipRepository: ClinicMembershipRepository);
    execute({ franchiseId, userId, }: ActivateFranchiseUseCaseRequest): Promise<ActivateFranchiseUseCaseResponse>;
}
export {};
