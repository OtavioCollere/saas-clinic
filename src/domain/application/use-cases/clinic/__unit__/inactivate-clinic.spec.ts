import { isLeft, isRight, unwrapEither } from '@/core/either/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ClinicHasPendingAppointmentsError } from '@/core/errors/clinic-has-pending-appointments-error';
import { ClinicNotFoundError } from '@/core/errors/clinic-not-found-error';
import { UserIsNotOwnerError } from '@/core/errors/user-is-not-owner-error';
import { Appointment } from '@/domain/enterprise/entities/appointment';
import { AppointmentStatus } from '@/domain/enterprise/value-objects/appointment-status';
import { ClinicStatus } from '@/domain/enterprise/value-objects/clinic-status';
import { UserRole } from '@/domain/enterprise/value-objects/user-role';
import { makeClinic } from 'tests/factories/makeClinic';
import { makeUser } from 'tests/factories/makeUser';
import { InMemoryAppointmentsRepository } from 'tests/in-memory-repositories/in-memory-appointments-repository';
import { InMemoryClinicRepository } from 'tests/in-memory-repositories/in-memory-clinic-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { InactivateClinicUseCase } from '../inactivate-clinic';

describe('InactivateClinicUseCase Unit Tests', () => {
  let sut: InactivateClinicUseCase;
  let inMemoryClinicRepository: InMemoryClinicRepository;
  let inMemoryAppointmentsRepository: InMemoryAppointmentsRepository;

  beforeEach(() => {
    inMemoryClinicRepository = new InMemoryClinicRepository();
    inMemoryAppointmentsRepository = new InMemoryAppointmentsRepository();
    sut = new InactivateClinicUseCase(inMemoryClinicRepository, inMemoryAppointmentsRepository);
  });

  it('should be able to inactivate a clinic', async () => {
    const owner = makeUser({
      role: UserRole.owner(),
    });
    const clinic = makeClinic({
      ownerId: owner.id,
      status: ClinicStatus.active(),
    });
    inMemoryClinicRepository.items.push(clinic);

    // Associate an empty franchise list to clinic (no appointments)
    const franchiseId = new UniqueEntityId().toString();
    inMemoryAppointmentsRepository.associateFranchisesToClinic(clinic.id.toString(), [franchiseId]);

    const result = await sut.execute({
      clinicId: clinic.id.toString(),
      userId: owner.id.toString(),
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).clinic.status.isInactive()).toBeTruthy();
    }
  });

  it('should not be able to inactivate a non existent clinic', async () => {
    const owner = makeUser({
      role: UserRole.owner(),
    });

    const result = await sut.execute({
      clinicId: 'non-existent-clinic-id',
      userId: owner.id.toString(),
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(ClinicNotFoundError);
  });

  it('should not be able to inactivate a clinic when user is not the owner', async () => {
    const owner = makeUser({
      role: UserRole.owner(),
    });
    const otherUser = makeUser({
      role: UserRole.owner(),
    });
    const clinic = makeClinic({
      ownerId: owner.id,
      status: ClinicStatus.active(),
    });
    inMemoryClinicRepository.items.push(clinic);

    const result = await sut.execute({
      clinicId: clinic.id.toString(),
      userId: otherUser.id.toString(),
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(UserIsNotOwnerError);
  });

  it('should not be able to inactivate a clinic with pending appointments', async () => {
    const owner = makeUser({
      role: UserRole.owner(),
    });
    const clinic = makeClinic({
      ownerId: owner.id,
      status: ClinicStatus.active(),
    });
    inMemoryClinicRepository.items.push(clinic);

    const franchiseId = new UniqueEntityId();
    inMemoryAppointmentsRepository.associateFranchisesToClinic(clinic.id.toString(), [
      franchiseId.toString(),
    ]);

    const startAt = new Date();
    const endAt = new Date(startAt.getTime() + 60 * 60 * 1000); // 1 hour later
    const pendingAppointment = Appointment.create({
      professionalId: new UniqueEntityId(),
      franchiseId: franchiseId,
      patientId: new UniqueEntityId(),
      name: 'Test Appointment',
      appointmentItems: [],
      startAt,
      endAt,
      status: AppointmentStatus.waiting(),
    });

    inMemoryAppointmentsRepository.items.push(pendingAppointment);

    const result = await sut.execute({
      clinicId: clinic.id.toString(),
      userId: owner.id.toString(),
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(ClinicHasPendingAppointmentsError);
  });
});
