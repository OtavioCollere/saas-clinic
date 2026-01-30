import { isLeft, isRight, unwrapEither } from '@/core/either/either';
import { AppointmentNotFoundError } from '@/core/errors/appointment-not-found-error';
import { PatientNotFoundError } from '@/core/errors/patient-not-found-error';
import { DomainError } from '@/core/errors/domain-error';
import { AppointmentStatus } from '@/domain/enterprise/value-objects/appointment-status';
import { makeAppointment } from 'test/factories/makeAppointment';
import { makePatient } from 'test/factories/makePatient';
import { InMemoryAppointmentsRepository } from 'test/in-memory-repositories/in-memory-appointments-repository';
import { InMemoryPatientRepository } from 'test/in-memory-repositories/in-memory-patient-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { ConfirmAppointmentUseCase } from '../confirm-appointment';

describe('ConfirmAppointmentUseCase Unit Tests', () => {
  let sut: ConfirmAppointmentUseCase;
  let inMemoryAppointmentsRepository: InMemoryAppointmentsRepository;
  let inMemoryPatientRepository: InMemoryPatientRepository;

  beforeEach(() => {
    inMemoryAppointmentsRepository = new InMemoryAppointmentsRepository();
    inMemoryPatientRepository = new InMemoryPatientRepository();
    sut = new ConfirmAppointmentUseCase(
      inMemoryAppointmentsRepository,
      inMemoryPatientRepository
    );
  });

  it('should be able to confirm a waiting appointment', async () => {
    const patient = makePatient();
    const appointment = makeAppointment({
      patientId: patient.id,
      status: AppointmentStatus.waiting(),
    });
    inMemoryPatientRepository.items.push(patient);
    inMemoryAppointmentsRepository.items.push(appointment);

    const result = await sut.execute({
      appointmentId: appointment.id.toString(),
      patientId: patient.id.toString(),
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).appointment.status.isConfirmed()).toBe(true);
      expect(unwrapEither(result).appointment.updatedAt).toBeDefined();
    }
  });

  it('should not be able to confirm a non existent appointment', async () => {
    const patient = makePatient();
    inMemoryPatientRepository.items.push(patient);

    const result = await sut.execute({
      appointmentId: 'non-existent-appointment-id',
      patientId: patient.id.toString(),
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(AppointmentNotFoundError);
  });

  it('should not be able to confirm an appointment with non existent patient', async () => {
    const appointment = makeAppointment({
      status: AppointmentStatus.waiting(),
    });
    inMemoryAppointmentsRepository.items.push(appointment);

    const result = await sut.execute({
      appointmentId: appointment.id.toString(),
      patientId: 'non-existent-patient-id',
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(PatientNotFoundError);
  });

  it('should not be able to confirm a confirmed appointment', async () => {
    const patient = makePatient();
    const appointment = makeAppointment({
      patientId: patient.id,
      status: AppointmentStatus.confirmed(),
    });
    inMemoryPatientRepository.items.push(patient);
    inMemoryAppointmentsRepository.items.push(appointment);

    const result = await sut.execute({
      appointmentId: appointment.id.toString(),
      patientId: patient.id.toString(),
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(DomainError);
  });
});
