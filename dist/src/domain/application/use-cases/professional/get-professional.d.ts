import { type Either } from '@/core/either/either';
import { ProfessionalNotFoundError } from '@/core/errors/professional-not-found-error';
import type { Professional } from '@/domain/enterprise/entities/professional';
import type { ProfessionalRepository } from '../../repositories/professional-repository';
interface GetProfessionalUseCaseRequest {
    professionalId: string;
}
type GetProfessionalUseCaseResponse = Either<ProfessionalNotFoundError, {
    professional: Professional;
}>;
export declare class GetProfessionalUseCase {
    private professionalRepository;
    constructor(professionalRepository: ProfessionalRepository);
    execute({ professionalId, }: GetProfessionalUseCaseRequest): Promise<GetProfessionalUseCaseResponse>;
}
export {};
