import { type Either } from '@/core/either/either';
import { FranchiseNotFoundError } from '@/core/errors/franchise-not-found-error';
import { ProfessionalAlreadyExistsError } from '@/core/errors/professional-already-exists-error';
import { UserIsNotOwnerError } from '@/core/errors/user-is-not-owner-error';
import { UserNotFoundError } from '@/core/errors/user-not-found-error';
import { Professional } from '@/domain/enterprise/entities/professional';
import type { ClinicMembershipRepository } from '../../repositories/clinic-membership-repository';
import type { FranchiseRepository } from '../../repositories/franchise-repository';
import type { ProfessionalRepository } from '../../repositories/professional-repository';
import type { UsersRepository } from '../../repositories/users-repository';
interface CreateProfessionalUseCaseRequest {
    franchiseId: string;
    userId: string;
    ownerId: string;
    council: string;
    councilNumber: string;
    councilState: string;
    profession: string;
}
type CreateProfessionalUseCaseResponse = Either<UserNotFoundError | FranchiseNotFoundError | ProfessionalAlreadyExistsError | UserIsNotOwnerError, {
    professional: Professional;
}>;
export declare class CreateProfessionalUseCase {
    private professionalRepository;
    private franchiseRepository;
    private usersRepository;
    private clinicMembershipRepository;
    constructor(professionalRepository: ProfessionalRepository, franchiseRepository: FranchiseRepository, usersRepository: UsersRepository, clinicMembershipRepository: ClinicMembershipRepository);
    execute({ franchiseId, userId, ownerId, council, councilNumber, councilState, profession, }: CreateProfessionalUseCaseRequest): Promise<CreateProfessionalUseCaseResponse>;
}
export {};
