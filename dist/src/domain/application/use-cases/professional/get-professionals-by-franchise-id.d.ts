import { type Either } from '@/core/either/either';
import { FranchiseNotFoundError } from '@/core/errors/franchise-not-found-error';
import type { Professional } from '@/domain/enterprise/entities/professional';
import type { FranchiseRepository } from '../../repositories/franchise-repository';
import type { ProfessionalRepository } from '../../repositories/professional-repository';
interface GetProfessionalsByFranchiseIdUseCaseRequest {
    franchiseId: string;
}
type GetProfessionalsByFranchiseIdUseCaseResponse = Either<FranchiseNotFoundError, {
    professionals: Professional[];
}>;
export declare class GetProfessionalsByFranchiseIdUseCase {
    private professionalRepository;
    private franchiseRepository;
    constructor(professionalRepository: ProfessionalRepository, franchiseRepository: FranchiseRepository);
    execute({ franchiseId, }: GetProfessionalsByFranchiseIdUseCaseRequest): Promise<GetProfessionalsByFranchiseIdUseCaseResponse>;
}
export {};
