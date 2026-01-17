import { OwnerNotFoundError } from '@/core/errors/owner-not-found-error';
import { Clinic } from '@/domain/enterprise/entities/clinic';
import type { ClinicMembershipRepository } from '../../repositories/clinic-membership-repository';
import type { ClinicRepository } from '../../repositories/clinic-repository';
import type { UsersRepository } from '../../repositories/users-repository';
interface CreateClinicUseCaseRequest {
    name: string;
    ownerId: string;
    description?: string;
    avatarUrl?: string;
}
export declare class CreateClinicUseCase {
    private clinicRepository;
    private usersRepository;
    private clinicMembershipRepository;
    constructor(clinicRepository: ClinicRepository, usersRepository: UsersRepository, clinicMembershipRepository: ClinicMembershipRepository);
    execute({ name, ownerId, description, avatarUrl }: CreateClinicUseCaseRequest): Promise<import("@/core/either/either").Left<OwnerNotFoundError> | import("@/core/either/either").Right<{
        clinic: Clinic;
    }>>;
}
export {};
