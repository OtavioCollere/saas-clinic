import { isRight, unwrapEither } from '@/shared/either/either';
import { makeAppointment } from 'test/factories/makeAppointment';
import { makePatient } from 'test/factories/makePatient';
import { InMemoryAppointmentsRepository } from 'test/in-memory-repositories/in-memory-appointments-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { FetchAppointmentsByPatientIdUseCase } from '../fetch-appointments-by-patient-id';

describe('FetchAppointmentsByPatientIdUseCase Unit Tests', () => {
  let sut: FetchAppointmentsByPatientIdUseCase;
  let inMemoryAppointmentsRepository: InMemoryAppointmentsRepository;

  beforeEach(() => {
    inMemoryAppointmentsRepository = new InMemoryAppointmentsRepository();
    sut = new FetchAppointmentsByPatientIdUseCase(inMemoryAppointmentsRepository);
  });

  it('should be able to fetch appointments by patient id', async () => {
    const patient = makePatient();
    const appointment1 = makeAppointment({
      patientId: patient.id,
    });
    const appointment2 = makeAppointment({
      patientId: patient.id,
    });
    const otherAppointment = makeAppointment();

    inMemoryAppointmentsRepository.items.push(appointment1, appointment2, otherAppointment);

    const result = await sut.execute({
      patientId: patient.id.toString(),
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).appointments).toHaveLength(2);
      expect(unwrapEither(result).appointments[0].id.toString()).toEqual(appointment1.id.toString());
      expect(unwrapEither(result).appointments[1].id.toString()).toEqual(appointment2.id.toString());
    }
  });

  it('should return empty array when patient has no appointments', async () => {
    const patient = makePatient();

    const result = await sut.execute({
      patientId: patient.id.toString(),
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).appointments).toHaveLength(0);
    }
  });
});
