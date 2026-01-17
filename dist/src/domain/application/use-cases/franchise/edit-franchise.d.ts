import { type Either } from '@/core/either/either';
import { FranchiseNotFoundError } from '@/core/errors/franchise-not-found-error';
import { UserIsNotOwnerError } from '@/core/errors/user-is-not-owner-error';
import type { Franchise } from '@/domain/enterprise/entities/franchise';
import type { ClinicMembershipRepository } from '../../repositories/clinic-membership-repository';
import type { FranchiseRepository } from '../../repositories/franchise-repository';
interface EditFranchiseUseCaseRequest {
    franchiseId: string;
    userId: string;
    name?: string;
    address?: string;
    zipCode?: string;
    description?: string;
}
type EditFranchiseUseCaseResponse = Either<FranchiseNotFoundError | UserIsNotOwnerError, {
    franchise: Franchise;
}>;
export declare class EditFranchiseUseCase {
    private franchiseRepository;
    private clinicMembershipRepository;
    constructor(franchiseRepository: FranchiseRepository, clinicMembershipRepository: ClinicMembershipRepository);
    execute({ franchiseId, userId, name, address, zipCode, description, }: EditFranchiseUseCaseRequest): Promise<EditFranchiseUseCaseResponse>;
}
export {};
