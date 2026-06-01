import { Inject, Injectable } from '@nestjs/common';
import { type Either, makeLeft, makeRight, isRight } from '@/shared/either/either';
import { UniqueEntityId } from '@/shared/entities/unique-entity-id';
import { ClinicMembership } from '@/domain/enterprise/entities/clinic-membership';
import { ClinicRole } from '@/domain/enterprise/value-objects/clinic-role';
import { User } from '@/domain/enterprise/entities/user';
import { UserRole } from '@/domain/enterprise/value-objects/user-role';
import { Cpf } from '@/domain/enterprise/value-objects/cpf';
import { Email } from '@/domain/enterprise/value-objects/email';
import { StaffMemberCreatedEvent } from '@/domain/enterprise/events/staff-member-created.event';
import { ClinicMembershipRepository } from '../../repositories/clinic-membership-repository';
import { ClinicRepository } from '../../repositories/clinic-repository';
import { UsersRepository } from '../../repositories/users-repository';
import { TransactionManager } from '../../transactions/transaction-manager';
import { HashGenerator } from '../../cryptography/hash-generator';
import { UserIsNotOwnerError } from '@/shared/errors/user-is-not-owner-error';
import { EmailAlreadyExistsError } from '@/shared/errors/email-already-exists-error';
import { CpfAlreadyExistsError } from '@/shared/errors/cpf-already-exists-error';
import { InvalidCpfError } from '@/shared/errors/invalid-cpf-error';
import { InvalidEmailError } from '@/shared/errors/invalid-email-error';
import { ClinicNotFoundError } from '@/shared/errors/clinic-not-found-error';
import { EventEmitter2 } from '@nestjs/event-emitter';
import crypto from 'crypto';

interface CreateStaffMemberRequest {
  name: string;
  cpf: string;
  email: string;
  clinicId: string;
  ownerId: string;
}

type CreateStaffMemberResponse = Either<
  | UserIsNotOwnerError
  | EmailAlreadyExistsError
  | CpfAlreadyExistsError
  | InvalidCpfError
  | InvalidEmailError
  | ClinicNotFoundError,
  { userId: string; name: string; email: string }
>;

@Injectable()
export class CreateStaffMemberUseCase {
  constructor(
    @Inject(ClinicRepository)
    private clinicRepository: ClinicRepository,
    @Inject(UsersRepository)
    private usersRepository: UsersRepository,
    @Inject(ClinicMembershipRepository)
    private clinicMembershipRepository: ClinicMembershipRepository,
    @Inject(TransactionManager)
    private transactionManager: TransactionManager,
    @Inject(HashGenerator)
    private hashGenerator: HashGenerator,
    @Inject(EventEmitter2)
    private eventEmitter: EventEmitter2,
  ) {}

  async execute({ name, cpf, email, clinicId, ownerId }: CreateStaffMemberRequest): Promise<CreateStaffMemberResponse> {
    const clinic = await this.clinicRepository.findById(clinicId);
    if (!clinic) return makeLeft(new ClinicNotFoundError());

    const ownerMembership = await this.clinicMembershipRepository.findByUserAndClinic(ownerId, clinicId);
    if (!ownerMembership || !ownerMembership.role.isOwner()) {
      return makeLeft(new UserIsNotOwnerError());
    }

    if (!Email.isValid(email)) return makeLeft(new InvalidEmailError());
    if (!Cpf.isValid(cpf)) return makeLeft(new InvalidCpfError());

    if (await this.usersRepository.findByEmail(email)) return makeLeft(new EmailAlreadyExistsError());
    if (await this.usersRepository.findByCpf(cpf)) return makeLeft(new CpfAlreadyExistsError());

    const cpfVO = Cpf.create(cpf);
    const emailVO = Email.create(email);

    const randomPassword = crypto.randomBytes(16).toString('hex');
    const passwordHash = await this.hashGenerator.hash(randomPassword);
    const passwordExpiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000);

    const result = await this.transactionManager.run(async (tx) => {
      const user = User.create({
        name,
        cpf: cpfVO,
        email: emailVO,
        password: passwordHash,
        role: UserRole.member(),
      });
      await this.usersRepository.create(user, tx);

      const membership = ClinicMembership.create({
        userId: user.id,
        clinicId: new UniqueEntityId(clinicId),
        role: ClinicRole.admin(),
      });
      await this.clinicMembershipRepository.create(membership, tx);

      return makeRight({ userId: user.id.toString(), name, email: emailVO.getValue(), password: randomPassword });
    });

    if (isRight(result)) {
      const { userId, email: userEmail, password } = result.value;
      this.eventEmitter.emit(
        'staff-member.created',
        new StaffMemberCreatedEvent(userId, clinicId, userEmail, password, passwordExpiresAt),
      );
      return makeRight({ userId, name, email: userEmail });
    }

    return result as CreateStaffMemberResponse;
  }
}
