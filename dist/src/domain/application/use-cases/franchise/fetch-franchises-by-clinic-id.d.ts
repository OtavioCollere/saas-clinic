import { type Either } from '@/core/either/either';
import { ClinicNotFoundError } from '@/core/errors/clinic-not-found-error';
import type { Franchise } from '@/domain/enterprise/entities/franchise';
import type { ClinicRepository } from '../../repositories/clinic-repository';
import type { FranchiseRepository } from '../../repositories/franchise-repository';
interface FetchFranchisesByClinicIdUseCaseRequest {
    clinicId: string;
}
type FetchFranchisesByClinicIdUseCaseResponse = Either<ClinicNotFoundError, {
    franchises: Franchise[];
}>;
export declare class FetchFranchisesByClinicIdUseCase {
    private franchiseRepository;
    private clinicRepository;
    constructor(franchiseRepository: FranchiseRepository, clinicRepository: ClinicRepository);
    execute({ clinicId, }: FetchFranchisesByClinicIdUseCaseRequest): Promise<FetchFranchisesByClinicIdUseCaseResponse>;
}
export {};
