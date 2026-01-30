import { isLeft, isRight, unwrapEither } from '@/core/either/either';
import { PatientNotFoundError } from '@/core/errors/patient-not-found-error';
import { makePatient } from 'test/factories/makePatient';
import { InMemoryAnamnesisRepository } from 'test/in-memory-repositories/in-memory-anamnesis-repository';
import { InMemoryPatientRepository } from 'test/in-memory-repositories/in-memory-patient-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreateAnamnesisUseCase } from '../create-anamnesis';

describe('CreateAnamnesisUseCase Unit Tests', () => {
  let sut: CreateAnamnesisUseCase;
  let inMemoryAnamnesisRepository: InMemoryAnamnesisRepository;
  let inMemoryPatientRepository: InMemoryPatientRepository;

  beforeEach(() => {
    inMemoryAnamnesisRepository = new InMemoryAnamnesisRepository();
    inMemoryPatientRepository = new InMemoryPatientRepository();
    sut = new CreateAnamnesisUseCase(
      inMemoryAnamnesisRepository,
      inMemoryPatientRepository
    );
  });

  it('should be able to create an anamnesis', async () => {
    const patient = makePatient();
    inMemoryPatientRepository.items.push(patient);

    const result = await sut.execute({
      patientId: patient.id.toString(),
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
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).anamnesis.patientId.toString()).toEqual(patient.id.toString());
      expect(inMemoryAnamnesisRepository.items).toHaveLength(1);
    }
  });

  it('should not be able to create anamnesis with non existent patient', async () => {
    const result = await sut.execute({
      patientId: 'non-existent-patient-id',
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
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(PatientNotFoundError);
  });
});
