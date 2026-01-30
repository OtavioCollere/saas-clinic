import { isRight, unwrapEither } from '@/core/either/either';
import { makePatient } from 'test/factories/makePatient';
import { InMemoryPatientRepository } from 'test/in-memory-repositories/in-memory-patient-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { FetchPatientsUseCase } from '../fetch-patients';

describe('FetchPatientsUseCase Unit Tests', () => {
  let sut: FetchPatientsUseCase;
  let inMemoryPatientRepository: InMemoryPatientRepository;

  beforeEach(() => {
    inMemoryPatientRepository = new InMemoryPatientRepository();
    sut = new FetchPatientsUseCase(inMemoryPatientRepository);
  });

  it('should be able to fetch patients with pagination', async () => {
    for (let i = 0; i < 22; i++) {
      const patient = makePatient({
        name: `Patient ${i + 1}`,
      });
      inMemoryPatientRepository.items.push(patient);
    }

    const result = await sut.execute({
      page: 1,
      pageSize: 20,
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).patients).toHaveLength(20);
    }
  });

  it('should be able to fetch patients with pagination on second page', async () => {
    for (let i = 0; i < 22; i++) {
      const patient = makePatient({
        name: `Patient ${i + 1}`,
      });
      inMemoryPatientRepository.items.push(patient);
    }

    const result = await sut.execute({
      page: 2,
      pageSize: 20,
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).patients).toHaveLength(2);
    }
  });

  it('should be able to fetch patients with query filter', async () => {
    const patient1 = makePatient({
      name: 'John Doe',
    });
    const patient2 = makePatient({
      name: 'Jane Doe',
    });
    const patient3 = makePatient({
      name: 'Another Person',
    });

    inMemoryPatientRepository.items.push(patient1, patient2, patient3);

    const result = await sut.execute({
      page: 1,
      pageSize: 20,
      query: 'Doe',
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).patients).toHaveLength(2);
      expect(unwrapEither(result).patients[0].name).toEqual('John Doe');
      expect(unwrapEither(result).patients[1].name).toEqual('Jane Doe');
    }
  });

  it('should be able to fetch patients with default page size', async () => {
    for (let i = 0; i < 25; i++) {
      const patient = makePatient({
        name: `Patient ${i + 1}`,
      });
      inMemoryPatientRepository.items.push(patient);
    }

    const result = await sut.execute({
      page: 1,
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).patients).toHaveLength(20);
    }
  });

  it('should return empty array when no patients match', async () => {
    const result = await sut.execute({
      page: 1,
      pageSize: 20,
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).patients).toHaveLength(0);
    }
  });
});
