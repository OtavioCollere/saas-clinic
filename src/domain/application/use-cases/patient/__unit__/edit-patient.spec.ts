import { isLeft, isRight, unwrapEither } from '@/core/either/either';
import { PatientNotFoundError } from '@/core/errors/patient-not-found-error';
import { makePatient } from 'test/factories/makePatient';
import { InMemoryPatientRepository } from 'test/in-memory-repositories/in-memory-patient-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { EditPatientUseCase } from '../edit-patient';

describe('EditPatientUseCase Unit Tests', () => {
  let sut: EditPatientUseCase;
  let inMemoryPatientRepository: InMemoryPatientRepository;

  beforeEach(() => {
    inMemoryPatientRepository = new InMemoryPatientRepository();
    sut = new EditPatientUseCase(inMemoryPatientRepository);
  });

  it('should be able to edit a patient', async () => {
    const patient = makePatient({
      name: 'John Doe',
      birthDay: new Date('1990-01-01'),
      address: '123 Main St',
      zipCode: '12345-678',
    });
    inMemoryPatientRepository.items.push(patient);

    const result = await sut.execute({
      patientId: patient.id.toString(),
      name: 'Jane Doe',
      address: '456 Oak Ave',
      zipCode: '98765-432',
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).patient.name).toEqual('Jane Doe');
      expect(unwrapEither(result).patient.address).toEqual('456 Oak Ave');
      expect(unwrapEither(result).patient.zipCode).toEqual('98765-432');
      expect(unwrapEither(result).patient.birthDay).toEqual(new Date('1990-01-01'));
      expect(unwrapEither(result).patient.updatedAt).toBeDefined();
    }
  });

  it('should not be able to edit a non existent patient', async () => {
    const result = await sut.execute({
      patientId: 'non-existent-patient-id',
      name: 'Jane Doe',
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(PatientNotFoundError);
  });

  it('should be able to edit only name', async () => {
    const patient = makePatient({
      name: 'John Doe',
      birthDay: new Date('1990-01-01'),
      address: '123 Main St',
      zipCode: '12345-678',
    });
    inMemoryPatientRepository.items.push(patient);

    const result = await sut.execute({
      patientId: patient.id.toString(),
      name: 'Jane Doe',
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).patient.name).toEqual('Jane Doe');
      expect(unwrapEither(result).patient.address).toEqual('123 Main St');
      expect(unwrapEither(result).patient.zipCode).toEqual('12345-678');
    }
  });
});
