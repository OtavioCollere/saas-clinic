import { type Either } from '@/core/either/either';
import { ClinicNotFoundError } from '@/core/errors/clinic-not-found-error';
import { UserIsNotOwnerError } from '@/core/errors/user-is-not-owner-error';
import type { Clinic } from '@/domain/enterprise/entities/clinic';
import type { ClinicMembershipRepository } from '../../repositories/clinic-membership-repository';
import type { ClinicRepository } from '../../repositories/clinic-repository';
interface ActivateClinicUseCaseRequest {
    clinicId: string;
    userId: string;
}
type ActivateClinicUseCaseResponse = Either<ClinicNotFoundError | UserIsNotOwnerError, {
    clinic: Clinic;
}>;
export declare class ActivateClinicUseCase {
    private clinicRepository;
    private clinicMembershipRepository;
    constructor(clinicRepository: ClinicRepository, clinicMembershipRepository: ClinicMembershipRepository);
    execute({ clinicId, userId, }: ActivateClinicUseCaseRequest): Promise<ActivateClinicUseCaseResponse>;
}
export {};
