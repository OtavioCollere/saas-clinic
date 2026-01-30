import { isLeft, isRight, unwrapEither } from '@/core/either/either';
import { PatientNotFoundError } from '@/core/errors/patient-not-found-error';
import { makeAnamnesis } from 'test/factories/makeAnamnesis';
import { makePatient } from 'test/factories/makePatient';
import { InMemoryAnamnesisRepository } from 'test/in-memory-repositories/in-memory-anamnesis-repository';
import { InMemoryPatientRepository } from 'test/in-memory-repositories/in-memory-patient-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetAnamnesisByPatientIdUseCase } from '../get-anamnesis-by-patient-id';

describe('GetAnamnesisByPatientIdUseCase Unit Tests', () => {
  let sut: GetAnamnesisByPatientIdUseCase;
  let inMemoryAnamnesisRepository: InMemoryAnamnesisRepository;
  let inMemoryPatientRepository: InMemoryPatientRepository;

  beforeEach(() => {
    inMemoryAnamnesisRepository = new InMemoryAnamnesisRepository();
    inMemoryPatientRepository = new InMemoryPatientRepository();
    sut = new GetAnamnesisByPatientIdUseCase(
      inMemoryAnamnesisRepository,
      inMemoryPatientRepository
    );
  });

  it('should be able to get anamnesis by patient id', async () => {
    const patient = makePatient();
    const anamnesis = makeAnamnesis({
      patientId: patient.id,
    });
    inMemoryPatientRepository.items.push(patient);
    inMemoryAnamnesisRepository.items.push(anamnesis);

    const result = await sut.execute({
      patientId: patient.id.toString(),
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).anamnesis).toBeTruthy();
      expect(unwrapEither(result).anamnesis?.patientId.toString()).toEqual(patient.id.toString());
    }
  });

  it('should return null when patient has no anamnesis', async () => {
    const patient = makePatient();
    inMemoryPatientRepository.items.push(patient);

    const result = await sut.execute({
      patientId: patient.id.toString(),
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).anamnesis).toBeNull();
    }
  });

  it('should not be able to get anamnesis with non existent patient', async () => {
    const result = await sut.execute({
      patientId: 'non-existent-patient-id',
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(PatientNotFoundError);
  });
});
