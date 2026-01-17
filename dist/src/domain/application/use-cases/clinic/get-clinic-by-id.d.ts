import { type Either } from '@/core/either/either';
import { ClinicNotFoundError } from '@/core/errors/clinic-not-found-error';
import type { Clinic } from '@/domain/enterprise/entities/clinic';
import type { ClinicRepository } from '../../repositories/clinic-repository';
interface GetClinicByIdUseCaseRequest {
    clinicId: string;
}
type GetClinicByIdUseCaseResponse = Either<ClinicNotFoundError, {
    clinic: Clinic;
}>;
export declare class GetClinicByIdUseCase {
    private clinicRepository;
    constructor(clinicRepository: ClinicRepository);
    execute({ clinicId }: GetClinicByIdUseCaseRequest): Promise<GetClinicByIdUseCaseResponse>;
}
export {};
