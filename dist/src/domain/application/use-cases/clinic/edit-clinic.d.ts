import { type Either } from '@/core/either/either';
import { ClinicAlreadyExistsError } from '@/core/errors/clinic-already-exists-error';
import { ClinicNotFoundError } from '@/core/errors/clinic-not-found-error';
import { UserIsNotOwnerError } from '@/core/errors/user-is-not-owner-error';
import type { Clinic } from '@/domain/enterprise/entities/clinic';
import type { ClinicMembershipRepository } from '../../repositories/clinic-membership-repository';
import type { ClinicRepository } from '../../repositories/clinic-repository';
interface EditClinicUseCaseRequest {
    editorId: string;
    clinicId: string;
    name?: string;
    description?: string;
    avatarUrl?: string;
}
type EditClinicUseCaseResponse = Either<UserIsNotOwnerError | ClinicNotFoundError | ClinicAlreadyExistsError, {
    clinic: Clinic;
}>;
export declare class EditClinicUseCase {
    private clinicRepository;
    private clinicMembershipRepository;
    constructor(clinicRepository: ClinicRepository, clinicMembershipRepository: ClinicMembershipRepository);
    execute({ clinicId, editorId, name, description, avatarUrl, }: EditClinicUseCaseRequest): Promise<EditClinicUseCaseResponse>;
}
export {};
