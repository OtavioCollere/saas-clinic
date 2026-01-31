import { isLeft, isRight, unwrapEither } from '@/shared/either/either';
import { AppointmentNotFoundError } from '@/shared/errors/appointment-not-found-error';
import { DomainError } from '@/shared/errors/domain-error';
import { AppointmentStatus } from '@/domain/enterprise/value-objects/appointment-status';
import { makeAppointment } from 'test/factories/makeAppointment';
import { InMemoryAppointmentsRepository } from 'test/in-memory-repositories/in-memory-appointments-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { CancelAppointmentUseCase } from '../cancel-appointment';

describe('CancelAppointmentUseCase Unit Tests', () => {
  let sut: CancelAppointmentUseCase;
  let inMemoryAppointmentsRepository: InMemoryAppointmentsRepository;

  beforeEach(() => {
    inMemoryAppointmentsRepository = new InMemoryAppointmentsRepository();
    sut = new CancelAppointmentUseCase(inMemoryAppointmentsRepository);
  });

  it('should be able to cancel a waiting appointment', async () => {
    const appointment = makeAppointment({
      status: AppointmentStatus.waiting(),
    });
    inMemoryAppointmentsRepository.items.push(appointment);

    const result = await sut.execute({
      appointmentId: appointment.id.toString(),
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).appointment.status.isCanceled()).toBe(true);
      expect(unwrapEither(result).appointment.updatedAt).toBeDefined();
    }
  });

  it('should not be able to cancel a non existent appointment', async () => {
    const result = await sut.execute({
      appointmentId: 'non-existent-appointment-id',
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(AppointmentNotFoundError);
  });

  it('should not be able to cancel a confirmed appointment', async () => {
    const appointment = makeAppointment({
      status: AppointmentStatus.confirmed(),
    });
    inMemoryAppointmentsRepository.items.push(appointment);

    const result = await sut.execute({
      appointmentId: appointment.id.toString(),
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(DomainError);
  });

  it('should not be able to cancel a done appointment', async () => {
    const appointment = makeAppointment({
      status: AppointmentStatus.done(),
    });
    inMemoryAppointmentsRepository.items.push(appointment);

    const result = await sut.execute({
      appointmentId: appointment.id.toString(),
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(DomainError);
  });
});
