import { isLeft, isRight, unwrapEither } from '@/shared/either/either';
import { UniqueEntityId } from '@/shared/entities/unique-entity-id';
import { FranchiseHasPendingAppointmentsError } from '@/shared/errors/franchise-has-pending-appointments-error';
import { FranchiseNotFoundError } from '@/shared/errors/franchise-not-found-error';
import { UserIsNotOwnerError } from '@/shared/errors/user-is-not-owner-error';
import { Appointment } from '@/domain/enterprise/entities/appointment';
import { AppointmentStatus } from '@/domain/enterprise/value-objects/appointment-status';
import { FranchiseStatus } from '@/domain/enterprise/value-objects/franchise-status';
import { ClinicRole } from '@/domain/enterprise/value-objects/clinic-role';
import { makeClinic } from 'tests/factories/makeClinic';
import { makeClinicMembership } from 'tests/factories/makeClinicMembership';
import { makeFranchise } from 'tests/factories/makeFranchise';
import { makeUser } from 'tests/factories/makeUser';
import { InMemoryAppointmentsRepository } from 'tests/in-memory-repositories/in-memory-appointments-repository';
import { InMemoryClinicMembershipRepository } from 'tests/in-memory-repositories/in-memory-clinic-membership-repository';
import { InMemoryFranchiseRepository } from 'tests/in-memory-repositories/in-memory-franchise-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { InactivateFranchiseUseCase } from '../inactivate-franchise';

describe('InactivateFranchiseUseCase Unit Tests', () => {
  let sut: InactivateFranchiseUseCase;
  let inMemoryFranchiseRepository: InMemoryFranchiseRepository;
  let inMemoryAppointmentsRepository: InMemoryAppointmentsRepository;
  let inMemoryClinicMembershipRepository: InMemoryClinicMembershipRepository;

  beforeEach(() => {
    inMemoryFranchiseRepository = new InMemoryFranchiseRepository();
    inMemoryAppointmentsRepository = new InMemoryAppointmentsRepository();
    inMemoryClinicMembershipRepository = new InMemoryClinicMembershipRepository();
    sut = new InactivateFranchiseUseCase(
      inMemoryFranchiseRepository,
      inMemoryAppointmentsRepository,
      inMemoryClinicMembershipRepository
    );
  });

  it('should be able to inactivate a franchise', async () => {
    const user = makeUser();
    const clinic = makeClinic({
      ownerId: user.id,
    });
    const franchise = makeFranchise({
      clinicId: clinic.id,
      status: FranchiseStatus.active(),
    });
    const membership = makeClinicMembership({
      userId: user.id,
      clinicId: clinic.id,
      role: ClinicRole.owner(),
    });
    inMemoryFranchiseRepository.items.push(franchise);
    inMemoryClinicMembershipRepository.items.push(membership);

    const result = await sut.execute({
      franchiseId: franchise.id.toString(),
      userId: user.id.toString(),
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).franchise.status.isInactive()).toBeTruthy();
    }
  });

  it('should not be able to inactivate a non existent franchise', async () => {
    const user = makeUser();

    const result = await sut.execute({
      franchiseId: 'non-existent-franchise-id',
      userId: user.id.toString(),
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(FranchiseNotFoundError);
  });

  it('should not be able to inactivate a franchise when user is not the owner', async () => {
    const owner = makeUser();
    const otherUser = makeUser();
    const clinic = makeClinic({
      ownerId: owner.id,
    });
    const franchise = makeFranchise({
      clinicId: clinic.id,
      status: FranchiseStatus.active(),
    });
    const membership = makeClinicMembership({
      userId: owner.id,
      clinicId: clinic.id,
      role: ClinicRole.owner(),
    });
    inMemoryFranchiseRepository.items.push(franchise);
    inMemoryClinicMembershipRepository.items.push(membership);

    const result = await sut.execute({
      franchiseId: franchise.id.toString(),
      userId: otherUser.id.toString(),
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(UserIsNotOwnerError);
  });

  it('should not be able to inactivate a franchise with pending appointments', async () => {
    const user = makeUser();
    const clinic = makeClinic({
      ownerId: user.id,
    });
    const franchise = makeFranchise({
      clinicId: clinic.id,
      status: FranchiseStatus.active(),
    });
    const membership = makeClinicMembership({
      userId: user.id,
      clinicId: clinic.id,
      role: ClinicRole.owner(),
    });
    inMemoryFranchiseRepository.items.push(franchise);
    inMemoryClinicMembershipRepository.items.push(membership);

    const startAt = new Date();
    const endAt = new Date(startAt.getTime() + 60 * 60 * 1000); // 1 hour later
    const pendingAppointment = Appointment.create({
      professionalId: new UniqueEntityId(),
      franchiseId: franchise.id,
      patientId: new UniqueEntityId(),
      name: 'Test Appointment',
      appointmentItems: [],
      startAt,
      endAt,
      status: AppointmentStatus.waiting(),
    });

    inMemoryAppointmentsRepository.items.push(pendingAppointment);

    const result = await sut.execute({
      franchiseId: franchise.id.toString(),
      userId: user.id.toString(),
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(FranchiseHasPendingAppointmentsError);
  });
});

