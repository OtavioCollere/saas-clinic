import { type Either } from '@/core/either/either';
import type { Clinic } from '@/domain/enterprise/entities/clinic';
import type { ClinicRepository } from '../../repositories/clinic-repository';
interface FetchClinicUseCaseRequest {
    page: number;
    pageSize?: number;
    query?: string;
}
type FetchClinicUseCaseResponse = Either<never, {
    clinics: Clinic[];
}>;
export declare class FetchClinicUseCase {
    private clinicRepository;
    constructor(clinicRepository: ClinicRepository);
    execute({ page, pageSize, query, }: FetchClinicUseCaseRequest): Promise<FetchClinicUseCaseResponse>;
}
export {};
