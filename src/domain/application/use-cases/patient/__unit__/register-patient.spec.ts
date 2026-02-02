import { isLeft, isRight, unwrapEither } from '@/shared/either/either';
import { ClinicNotFoundError } from '@/shared/errors/clinic-not-found-error';
import { UserNotFoundError } from '@/shared/errors/user-not-found-error';
import { makeClinic } from 'test/factories/makeClinic';
import { makeUser } from 'test/factories/makeUser';
import { InMemoryAnamnesisRepository } from 'test/in-memory-repositories/in-memory-anamnesis-repository';
import { InMemoryClinicRepository } from 'test/in-memory-repositories/in-memory-clinic-repository';
import { InMemoryPatientRepository } from 'test/in-memory-repositories/in-memory-patient-repository';
import { InMemoryUsersRepository } from 'test/in-memory-repositories/in-memory-users-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { RegisterPatientUseCase } from '../register-patient';

describe('RegisterPatientUseCase Unit Tests', () => {
  let sut: RegisterPatientUseCase;
  let inMemoryPatientRepository: InMemoryPatientRepository;
  let inMemoryAnamnesisRepository: InMemoryAnamnesisRepository;
  let inMemoryClinicRepository: InMemoryClinicRepository;
  let inMemoryUsersRepository: InMemoryUsersRepository;

  beforeEach(() => {
    inMemoryPatientRepository = new InMemoryPatientRepository();
    inMemoryAnamnesisRepository = new InMemoryAnamnesisRepository();
    inMemoryClinicRepository = new InMemoryClinicRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new RegisterPatientUseCase(
      inMemoryPatientRepository,
      inMemoryAnamnesisRepository,
      inMemoryClinicRepository,
      inMemoryUsersRepository
    );
  });

  it('should be able to register a patient with anamnesis', async () => {
    const clinic = makeClinic();
    const user = makeUser();

    inMemoryClinicRepository.items.push(clinic);
    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      clinicId: clinic.id.toString(),
      personId: user.id.toString(),
      name: 'John Doe',
      birthDay: new Date('1990-01-01'),
      address: '123 Main St',
      zipCode: '12345-678',
      anamnesis: {
        aestheticHistory: {
          hadPreviousAestheticTreatment: false,
          botulinumToxin: false,
          filler: false,
          suspensionThreads: false,
          surgicalLift: false,
          chemicalPeeling: false,
          laser: false,
          exposedToHeatOrColdWork: false,
        },
        healthConditions: {
          smoker: false,
          circulatoryDisorder: false,
          epilepsy: false,
          regularMenstrualCycle: true,
          regularIntestinalFunction: true,
          cardiacAlterations: false,
          hormonalDisorder: false,
          hypoOrHypertension: false,
          renalDisorder: false,
          varicoseVeinsOrLesions: false,
          pregnant: false,
          underMedicalTreatment: false,
        },
        medicalHistory: {
          usesMedication: false,
          allergy: false,
          lactoseIntolerance: false,
          diabetes: 'no',
          roacutan: false,
          recentSurgery: false,
          tumorOrPrecancerousLesion: false,
          skinProblems: false,
          orthopedicProblems: false,
          hasBodyOrFacialProsthesis: false,
          usingAcids: false,
        },
        physicalAssessment: {
          bloodPressure: '120/80',
          height: 170,
          initialWeight: 70,
        },
      },
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).patient.name).toEqual('John Doe');
      expect(unwrapEither(result).patient.clinicId.toString()).toEqual(clinic.id.toString());
      expect(unwrapEither(result).patient.userId.toString()).toEqual(user.id.toString());
      expect(unwrapEither(result).patient.anamnesis).toBeDefined();
      expect(inMemoryPatientRepository.items).toHaveLength(1);
      expect(inMemoryAnamnesisRepository.items).toHaveLength(1);
      expect(inMemoryAnamnesisRepository.items[0].patientId.toString()).toEqual(
        unwrapEither(result).patient.id.toString()
      );
    }
  });

  it('should not be able to register a patient with non existent clinic', async () => {
    const user = makeUser();
    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      clinicId: 'non-existent-clinic-id',
      personId: user.id.toString(),
      name: 'John Doe',
      birthDay: new Date('1990-01-01'),
      address: '123 Main St',
      zipCode: '12345-678',
      anamnesis: {
        aestheticHistory: {
          hadPreviousAestheticTreatment: false,
          botulinumToxin: false,
          filler: false,
          suspensionThreads: false,
          surgicalLift: false,
          chemicalPeeling: false,
          laser: false,
          exposedToHeatOrColdWork: false,
        },
        healthConditions: {
          smoker: false,
          circulatoryDisorder: false,
          epilepsy: false,
          regularMenstrualCycle: true,
          regularIntestinalFunction: true,
          cardiacAlterations: false,
          hormonalDisorder: false,
          hypoOrHypertension: false,
          renalDisorder: false,
          varicoseVeinsOrLesions: false,
          pregnant: false,
          underMedicalTreatment: false,
        },
        medicalHistory: {
          usesMedication: false,
          allergy: false,
          lactoseIntolerance: false,
          diabetes: 'no',
          roacutan: false,
          recentSurgery: false,
          tumorOrPrecancerousLesion: false,
          skinProblems: false,
          orthopedicProblems: false,
          hasBodyOrFacialProsthesis: false,
          usingAcids: false,
        },
        physicalAssessment: {
          bloodPressure: '120/80',
          height: 170,
          initialWeight: 70,
        },
      },
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(ClinicNotFoundError);
  });

  it('should not be able to register a patient with non existent user', async () => {
    const clinic = makeClinic();
    inMemoryClinicRepository.items.push(clinic);

    const result = await sut.execute({
      clinicId: clinic.id.toString(),
      personId: 'non-existent-user-id',
      name: 'John Doe',
      birthDay: new Date('1990-01-01'),
      address: '123 Main St',
      zipCode: '12345-678',
      anamnesis: {
        aestheticHistory: {
          hadPreviousAestheticTreatment: false,
          botulinumToxin: false,
          filler: false,
          suspensionThreads: false,
          surgicalLift: false,
          chemicalPeeling: false,
          laser: false,
          exposedToHeatOrColdWork: false,
        },
        healthConditions: {
          smoker: false,
          circulatoryDisorder: false,
          epilepsy: false,
          regularMenstrualCycle: true,
          regularIntestinalFunction: true,
          cardiacAlterations: false,
          hormonalDisorder: false,
          hypoOrHypertension: false,
          renalDisorder: false,
          varicoseVeinsOrLesions: false,
          pregnant: false,
          underMedicalTreatment: false,
        },
        medicalHistory: {
          usesMedication: false,
          allergy: false,
          lactoseIntolerance: false,
          diabetes: 'no',
          roacutan: false,
          recentSurgery: false,
          tumorOrPrecancerousLesion: false,
          skinProblems: false,
          orthopedicProblems: false,
          hasBodyOrFacialProsthesis: false,
          usingAcids: false,
        },
        physicalAssessment: {
          bloodPressure: '120/80',
          height: 170,
          initialWeight: 70,
        },
      },
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(UserNotFoundError);
  });
});
