import { isLeft, isRight, unwrapEither } from '@/shared/either/either';
import { ClinicNotFoundError } from '@/shared/errors/clinic-not-found-error';
import { EmailAlreadyExistsError } from '@/shared/errors/email-already-exists-error';
import { CpfAlreadyExistsError } from '@/shared/errors/cpf-already-exists-error';
import { InvalidCpfError } from '@/shared/errors/invalid-cpf-error';
import { InvalidEmailError } from '@/shared/errors/invalid-email-error';
import { makeClinic } from 'test/factories/makeClinic';
import { InMemoryClinicRepository } from 'test/in-memory-repositories/in-memory-clinic-repository';
import { InMemoryPatientRepository } from 'test/in-memory-repositories/in-memory-patient-repository';
import { InMemoryUsersRepository } from 'test/in-memory-repositories/in-memory-users-repository';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RegisterPatientUseCase } from '../register-patient';
import { HashGenerator } from '@/domain/application/cryptography/hash-generator';
import { TransactionManager } from '@/domain/application/transactions/transaction-manager';

describe('RegisterPatientUseCase Unit Tests', () => {
  let sut: RegisterPatientUseCase;
  let inMemoryPatientRepository: InMemoryPatientRepository;
  let inMemoryClinicRepository: InMemoryClinicRepository;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let hashGenerator: HashGenerator;
  let transactionManager: TransactionManager;

  beforeEach(() => {
    inMemoryPatientRepository = new InMemoryPatientRepository();
    inMemoryClinicRepository = new InMemoryClinicRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    
    hashGenerator = {
      hash: vi.fn().mockResolvedValue('hashed-password'),
    } as any;

    transactionManager = {
      run: vi.fn(async (callback) => {
        return callback(undefined);
      }),
    } as any;

    sut = new RegisterPatientUseCase(
      hashGenerator,
      inMemoryPatientRepository,
      inMemoryClinicRepository,
      inMemoryUsersRepository,
      transactionManager
    );
  });

  it('should be able to register a patient', async () => {
    const clinic = makeClinic();
    inMemoryClinicRepository.items.push(clinic);

    const result = await sut.execute({
      clinicId: clinic.id.toString(),
      name: 'John Doe',
      cpf: '12345678900',
      email: 'john.doe@example.com',
      birthDay: new Date('1990-01-01'),
      address: '123 Main St',
      zipCode: '12345-678',
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).patient.name).toEqual('John Doe');
      expect(unwrapEither(result).patient.clinicId.toString()).toEqual(clinic.id.toString());
      expect(inMemoryPatientRepository.items).toHaveLength(1);
      expect(inMemoryUsersRepository.items).toHaveLength(1);
      expect(inMemoryUsersRepository.items[0].name).toEqual('John Doe');
    }
  });

  it('should not be able to register a patient with non existent clinic', async () => {
    const result = await sut.execute({
      clinicId: 'non-existent-clinic-id',
      name: 'John Doe',
      cpf: '12345678900',
      email: 'john.doe@example.com',
      birthDay: new Date('1990-01-01'),
      address: '123 Main St',
      zipCode: '12345-678',
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(ClinicNotFoundError);
  });

  it('should not be able to register a patient with duplicate email', async () => {
    const clinic = makeClinic();
    const existingUser = makeUser();
    
    inMemoryClinicRepository.items.push(clinic);
    inMemoryUsersRepository.items.push(existingUser);

    const result = await sut.execute({
      clinicId: clinic.id.toString(),
      name: 'John Doe',
      cpf: '12345678900',
      email: existingUser.email.getValue(),
      birthDay: new Date('1990-01-01'),
      address: '123 Main St',
      zipCode: '12345-678',
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(EmailAlreadyExistsError);
  });

  it('should not be able to register a patient with duplicate CPF', async () => {
    const clinic = makeClinic();
    const existingUser = makeUser();
    
    inMemoryClinicRepository.items.push(clinic);
    inMemoryUsersRepository.items.push(existingUser);

    const result = await sut.execute({
      clinicId: clinic.id.toString(),
      name: 'John Doe',
      cpf: existingUser.cpf.getValue(),
      email: 'different@example.com',
      birthDay: new Date('1990-01-01'),
      address: '123 Main St',
      zipCode: '12345-678',
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(CpfAlreadyExistsError);
  });

  it('should not be able to register a patient with invalid CPF', async () => {
    const clinic = makeClinic();
    inMemoryClinicRepository.items.push(clinic);

    const result = await sut.execute({
      clinicId: clinic.id.toString(),
      name: 'John Doe',
      cpf: '00000000000',
      email: 'john.doe@example.com',
      birthDay: new Date('1990-01-01'),
      address: '123 Main St',
      zipCode: '12345-678',
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(InvalidCpfError);
  });

  it('should not be able to register a patient with invalid email', async () => {
    const clinic = makeClinic();
    inMemoryClinicRepository.items.push(clinic);

    const result = await sut.execute({
      clinicId: clinic.id.toString(),
      name: 'John Doe',
      cpf: '12345678900',
      email: 'invalid-email',
      birthDay: new Date('1990-01-01'),
      address: '123 Main St',
      zipCode: '12345-678',
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(InvalidEmailError);
  });
});
