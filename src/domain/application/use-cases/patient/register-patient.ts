import { Injectable } from "@nestjs/common";
import { Either, makeLeft, makeRight } from '@/shared/either/either';
import { UniqueEntityId } from '@/shared/entities/unique-entity-id';
import { ClinicNotFoundError } from '@/shared/errors/clinic-not-found-error';
import { UserNotFoundError } from '@/shared/errors/user-not-found-error';
import { AestheticHistory } from '@/domain/enterprise/entities/anamnesis/aesthetic-history';
import { Anamnesis } from '@/domain/enterprise/entities/anamnesis/anamnesis';
import { HealthConditions } from '@/domain/enterprise/entities/anamnesis/health-conditions';
import { MedicalHistory } from '@/domain/enterprise/entities/anamnesis/medical-history';
import { PhysicalAssessment } from '@/domain/enterprise/entities/anamnesis/physical-assessment';
import { Patient } from '@/domain/enterprise/entities/patient';
import { AnamnesisRepository } from '../../repositories/anamnesis-repository';
import { ClinicRepository } from '../../repositories/clinic-repository';
import { PatientRepository } from '../../repositories/patient-repository';
import { UsersRepository } from '../../repositories/users-repository';

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

type RegisterPatientUseCaseResponse = Either<
  ClinicNotFoundError | UserNotFoundError,
  {
    patient: Patient;
  }
>;

@Injectable()
export class RegisterPatientUseCase {
  constructor(
    private patientRepository: PatientRepository,
    private anamnesisRepository: AnamnesisRepository,
    private clinicRepository: ClinicRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    clinicId,
    personId,
    name,
    birthDay,
    address,
    zipCode,
    anamnesis: anamnesisData,
  }: RegisterPatientUseCaseRequest): Promise<RegisterPatientUseCaseResponse> {
    const clinic = await this.clinicRepository.findById(clinicId);

    if (!clinic) {
      return makeLeft(new ClinicNotFoundError());
    }

    const user = await this.usersRepository.findById(personId);

    if (!user) {
      return makeLeft(new UserNotFoundError());
    }

    const patient = Patient.create({
      clinicId: new UniqueEntityId(clinicId),
      userId: new UniqueEntityId(personId),
      name,
      birthDay,
      address,
      zipCode,
      anamnesis: Anamnesis.create({
        patientId: new UniqueEntityId(),
        aestheticHistory: anamnesisData.aestheticHistory,
        healthConditions: anamnesisData.healthConditions,
        medicalHistory: anamnesisData.medicalHistory,
        physicalAssessment: anamnesisData.physicalAssessment,
      }),
    });

    patient.anamnesis.patientId = patient.id;

    await this.anamnesisRepository.create(patient.anamnesis);
    await this.patientRepository.create(patient);

    return makeRight({ patient });
  }
}
