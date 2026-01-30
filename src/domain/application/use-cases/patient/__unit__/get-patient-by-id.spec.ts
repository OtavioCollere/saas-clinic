import { isLeft, isRight, unwrapEither } from '@/core/either/either';
import { PatientNotFoundError } from '@/core/errors/patient-not-found-error';
import { makePatient } from 'test/factories/makePatient';
import { InMemoryPatientRepository } from 'test/in-memory-repositories/in-memory-patient-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetPatientByIdUseCase } from '../get-patient-by-id';

describe('GetPatientByIdUseCase Unit Tests', () => {
  let sut: GetPatientByIdUseCase;
  let inMemoryPatientRepository: InMemoryPatientRepository;

  beforeEach(() => {
    inMemoryPatientRepository = new InMemoryPatientRepository();
    sut = new GetPatientByIdUseCase(inMemoryPatientRepository);
  });

  it('should be able to get a patient by id', async () => {
    const patient = makePatient({
      name: 'John Doe',
      birthDay: new Date('1990-01-01'),
      address: '123 Main St',
      zipCode: '12345-678',
    });
    inMemoryPatientRepository.items.push(patient);

    const result = await sut.execute({
      patientId: patient.id.toString(),
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).patient.id.toString()).toEqual(patient.id.toString());
      expect(unwrapEither(result).patient.name).toEqual('John Doe');
      expect(unwrapEither(result).patient.birthDay).toEqual(new Date('1990-01-01'));
      expect(unwrapEither(result).patient.address).toEqual('123 Main St');
      expect(unwrapEither(result).patient.zipCode).toEqual('12345-678');
    }
  });

  it('should not be able to get a non existent patient', async () => {
    const result = await sut.execute({
      patientId: 'non-existent-patient-id',
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(PatientNotFoundError);
  });
});
