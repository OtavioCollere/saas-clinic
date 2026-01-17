import { type Either } from '@/core/either/either';
import { ProfessionalNotFoundError } from '@/core/errors/professional-not-found-error';
import { UserIsNotOwnerError } from '@/core/errors/user-is-not-owner-error';
import type { Professional } from '@/domain/enterprise/entities/professional';
import type { ClinicMembershipRepository } from '../../repositories/clinic-membership-repository';
import type { FranchiseRepository } from '../../repositories/franchise-repository';
import type { ProfessionalRepository } from '../../repositories/professional-repository';
interface EditProfessionalUseCaseRequest {
    professionalId: string;
    editorId: string;
    council?: string;
    councilNumber?: string;
    councilState?: string;
    profession?: string;
}
type EditProfessionalUseCaseResponse = Either<ProfessionalNotFoundError | UserIsNotOwnerError, {
    professional: Professional;
}>;
export declare class EditProfessionalUseCase {
    private professionalRepository;
    private franchiseRepository;
    private clinicMembershipRepository;
    constructor(professionalRepository: ProfessionalRepository, franchiseRepository: FranchiseRepository, clinicMembershipRepository: ClinicMembershipRepository);
    execute({ professionalId, editorId, council, councilNumber, councilState, profession, }: EditProfessionalUseCaseRequest): Promise<EditProfessionalUseCaseResponse>;
}
export {};
