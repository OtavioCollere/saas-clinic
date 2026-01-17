import { type Either } from '@/core/either/either';
import { ClinicNotFoundError } from '@/core/errors/clinic-not-found-error';
import { UserIsNotOwnerError } from '@/core/errors/user-is-not-owner-error';
import { Franchise } from '@/domain/enterprise/entities/franchise';
import type { ClinicMembershipRepository } from '../../repositories/clinic-membership-repository';
import type { ClinicRepository } from '../../repositories/clinic-repository';
import type { FranchiseRepository } from '../../repositories/franchise-repository';
interface RegisterFranchiseUseCaseRequest {
    clinicId: string;
    userId: string;
    name: string;
    address: string;
    zipCode: string;
    description?: string;
}
type RegisterFranchiseUseCaseResponse = Either<ClinicNotFoundError | UserIsNotOwnerError, {
    franchise: Franchise;
}>;
export declare class RegisterFranchiseUseCase {
    private clinicRepository;
    private franchiseRepository;
    private clinicMembershipRepository;
    constructor(clinicRepository: ClinicRepository, franchiseRepository: FranchiseRepository, clinicMembershipRepository: ClinicMembershipRepository);
    execute({ clinicId, userId, name, address, zipCode, description, }: RegisterFranchiseUseCaseRequest): Promise<RegisterFranchiseUseCaseResponse>;
}
export {};
