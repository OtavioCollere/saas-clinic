import { isLeft, isRight, unwrapEither } from '@/shared/either/either';
import { UniqueEntityId } from '@/shared/entities/unique-entity-id';
import { ClinicHasPendingAppointmentsError } from '@/shared/errors/clinic-has-pending-appointments-error';
import { ClinicNotFoundError } from '@/shared/errors/clinic-not-found-error';
import { UserIsNotOwnerError } from '@/shared/errors/user-is-not-owner-error';
import { Appointment } from '@/domain/enterprise/entities/appointment';
import { AppointmentStatus } from '@/domain/enterprise/value-objects/appointment-status';
import { ClinicStatus } from '@/domain/enterprise/value-objects/clinic-status';
import { ClinicRole } from '@/domain/enterprise/value-objects/clinic-role';
import { makeClinic } from 'tests/factories/makeClinic';
import { makeClinicMembership } from 'tests/factories/makeClinicMembership';
import { makeUser } from 'tests/factories/makeUser';
import { InMemoryAppointmentsRepository } from 'tests/in-memory-repositories/in-memory-appointments-repository';
import { InMemoryClinicMembershipRepository } from 'tests/in-memory-repositories/in-memory-clinic-membership-repository';
import { InMemoryClinicRepository } from 'tests/in-memory-repositories/in-memory-clinic-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { InactivateClinicUseCase } from '../inactivate-clinic';

describe('InactivateClinicUseCase Unit Tests', () => {
  let sut: InactivateClinicUseCase;
  let inMemoryClinicRepository: InMemoryClinicRepository;
  let inMemoryAppointmentsRepository: InMemoryAppointmentsRepository;
  let inMemoryClinicMembershipRepository: InMemoryClinicMembershipRepository;

  beforeEach(() => {
    inMemoryClinicRepository = new InMemoryClinicRepository();
    inMemoryAppointmentsRepository = new InMemoryAppointmentsRepository();
    inMemoryClinicMembershipRepository = new InMemoryClinicMembershipRepository();
    sut = new InactivateClinicUseCase(
      inMemoryClinicRepository,
      inMemoryAppointmentsRepository,
      inMemoryClinicMembershipRepository
    );
  });

  it('should be able to inactivate a clinic', async () => {
    const user = makeUser();
    const clinic = makeClinic({
      ownerId: user.id,
      status: ClinicStatus.active(),
    });
    const membership = makeClinicMembership({
      userId: user.id,
      clinicId: clinic.id,
      role: ClinicRole.owner(),
    });
    inMemoryClinicRepository.items.push(clinic);
    inMemoryClinicMembershipRepository.items.push(membership);

    // Associate an empty franchise list to clinic (no appointments)
    const franchiseId = new UniqueEntityId().toString();
    inMemoryAppointmentsRepository.associateFranchisesToClinic(clinic.id.toString(), [franchiseId]);

    const result = await sut.execute({
      clinicId: clinic.id.toString(),
      userId: user.id.toString(),
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).clinic.status.isInactive()).toBeTruthy();
    }
  });

  it('should not be able to inactivate a non existent clinic', async () => {
    const user = makeUser();

    const result = await sut.execute({
      clinicId: 'non-existent-clinic-id',
      userId: user.id.toString(),
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(ClinicNotFoundError);
  });

  it('should not be able to inactivate a clinic when user is not the owner', async () => {
    const owner = makeUser();
    const otherUser = makeUser();
    const clinic = makeClinic({
      ownerId: owner.id,
      status: ClinicStatus.active(),
    });
    const membership = makeClinicMembership({
      userId: owner.id,
      clinicId: clinic.id,
      role: ClinicRole.owner(),
    });
    inMemoryClinicRepository.items.push(clinic);
    inMemoryClinicMembershipRepository.items.push(membership);

    const result = await sut.execute({
      clinicId: clinic.id.toString(),
      userId: otherUser.id.toString(),
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(UserIsNotOwnerError);
  });

  it('should not be able to inactivate a clinic with pending appointments', async () => {
    const user = makeUser();
    const clinic = makeClinic({
      ownerId: user.id,
      status: ClinicStatus.active(),
    });
    const membership = makeClinicMembership({
      userId: user.id,
      clinicId: clinic.id,
      role: ClinicRole.owner(),
    });
    inMemoryClinicRepository.items.push(clinic);
    inMemoryClinicMembershipRepository.items.push(membership);

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
      userId: user.id.toString(),
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(ClinicHasPendingAppointmentsError);
  });
});
