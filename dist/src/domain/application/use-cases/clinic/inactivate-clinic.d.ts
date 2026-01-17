import { type Either } from '@/core/either/either';
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
type InactivateClinicUseCaseResponse = Either<ClinicNotFoundError | UserIsNotOwnerError | ClinicHasPendingAppointmentsError, {
    clinic: Clinic;
}>;
export declare class InactivateClinicUseCase {
    private clinicRepository;
    private appointmentsRepository;
    private clinicMembershipRepository;
    constructor(clinicRepository: ClinicRepository, appointmentsRepository: AppointmentsRepository, clinicMembershipRepository: ClinicMembershipRepository);
    execute({ clinicId, userId, }: InactivateClinicUseCaseRequest): Promise<InactivateClinicUseCaseResponse>;
}
export {};
