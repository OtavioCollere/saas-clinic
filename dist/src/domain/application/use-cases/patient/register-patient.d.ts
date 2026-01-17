import { type Either } from '@/core/either/either';
import { ClinicNotFoundError } from '@/core/errors/clinic-not-found-error';
import { UserNotFoundError } from '@/core/errors/user-not-found-error';
import type { AestheticHistory } from '@/domain/enterprise/entities/anamnesis/aesthetic-history';
import type { HealthConditions } from '@/domain/enterprise/entities/anamnesis/health-conditions';
import type { MedicalHistory } from '@/domain/enterprise/entities/anamnesis/medical-history';
import type { PhysicalAssessment } from '@/domain/enterprise/entities/anamnesis/physical-assessment';
import { Patient } from '@/domain/enterprise/entities/patient';
import type { AnamnesisRepository } from '../../repositories/anamnesis-repository';
import type { ClinicRepository } from '../../repositories/clinic-repository';
import type { PatientRepository } from '../../repositories/patient-repository';
import type { UsersRepository } from '../../repositories/users-repository';
interface RegisterPatientUseCaseRequest {
    clinicId: string;
    personId: string;
    name: string;
    birthDay: Date;
    address: string;
    zipCode: string;
    anamnesis: {
        aestheticHistory: AestheticHistory;
        healthConditions: HealthConditions;
        medicalHistory: MedicalHistory;
        physicalAssessment: PhysicalAssessment;
    };
}
type RegisterPatientUseCaseResponse = Either<ClinicNotFoundError | UserNotFoundError, {
    patient: Patient;
}>;
export declare class RegisterPatientUseCase {
    private patientRepository;
    private anamnesisRepository;
    private clinicRepository;
    private usersRepository;
    constructor(patientRepository: PatientRepository, anamnesisRepository: AnamnesisRepository, clinicRepository: ClinicRepository, usersRepository: UsersRepository);
    execute({ clinicId, personId, name, birthDay, address, zipCode, anamnesis: anamnesisData, }: RegisterPatientUseCaseRequest): Promise<RegisterPatientUseCaseResponse>;
}
export {};
