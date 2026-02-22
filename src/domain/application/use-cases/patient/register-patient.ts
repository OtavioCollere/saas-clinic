import { Inject, Injectable } from "@nestjs/common";
import { type Either, makeLeft, makeRight, isRight, unwrapEither } from '@/shared/either/either';
import { UniqueEntityId } from '@/shared/entities/unique-entity-id';
import { ClinicNotFoundError } from '@/shared/errors/clinic-not-found-error';
import { Patient } from '@/domain/enterprise/entities/patient';
import { ClinicMembership } from '@/domain/enterprise/entities/clinic-membership';
import { ClinicRole } from '@/domain/enterprise/value-objects/clinic-role';
import { ClinicMembershipRepository } from '../../repositories/clinic-membership-repository';
import { ClinicRepository } from '../../repositories/clinic-repository';
import { PatientRepository } from '../../repositories/patient-repository';
import { UsersRepository } from '../../repositories/users-repository';
import { CpfAlreadyExistsError } from '@/shared/errors/cpf-already-exists-error';
import { Cpf } from '@/domain/enterprise/value-objects/cpf';
import { InvalidCpfError } from '@/shared/errors/invalid-cpf-error';
import { Email } from '@/domain/enterprise/value-objects/email';
import { InvalidEmailError } from '@/shared/errors/invalid-email-error';
import { EmailAlreadyExistsError } from '@/shared/errors/email-already-exists-error';
import { TransactionManager } from '../../transactions/transaction-manager';
import { User } from '@/domain/enterprise/entities/user';
import { UserRole } from '@/domain/enterprise/value-objects/user-role';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PatientCreatedEvent } from '@/domain/enterprise/events/patient-created.event';

interface RegisterPatientUseCaseRequest {
  clinicId: string;
  name: string;
  cpf: string;
  email: string;
  birthDay: Date;
  address: string;
  zipCode: string;
}

type RegisterPatientUseCaseResponse = Either<
  EmailAlreadyExistsError | CpfAlreadyExistsError | InvalidCpfError | InvalidEmailError | ClinicNotFoundError,
  {
    patient: Patient;
  }
>;

@Injectable()
export class RegisterPatientUseCase {
  constructor(
    @Inject(PatientRepository)
    private patientRepository: PatientRepository,
    @Inject(ClinicRepository)
    private clinicRepository: ClinicRepository,
    @Inject(ClinicMembershipRepository)
    private clinicMembershipRepository: ClinicMembershipRepository,
    @Inject(UsersRepository)
    private usersRepository: UsersRepository,
    @Inject(TransactionManager)
    private transactionManager: TransactionManager,
    @Inject(EventEmitter2)
    private eventEmitter: EventEmitter2,
  ) {}

  async execute({
    clinicId,
    name,
    cpf,
    email,
    birthDay,
    address,
    zipCode,
  }: RegisterPatientUseCaseRequest): Promise<RegisterPatientUseCaseResponse> {
    // Validações de email e CPF
    const emailExists = await this.usersRepository.findByEmail(email);
    if (emailExists) {
      return makeLeft(new EmailAlreadyExistsError());
    }

    const cpfExists = await this.usersRepository.findByCpf(cpf);
    if (cpfExists) {
      return makeLeft(new CpfAlreadyExistsError());
    }

    const isValidCpf = Cpf.isValid(cpf);
    if (!isValidCpf) {
      return makeLeft(new InvalidCpfError());
    }

    const isValidEmail = Email.isValid(email);
    if (!isValidEmail) {
      return makeLeft(new InvalidEmailError());
    }

    // Validação de clínica (antes da transação)
    const clinic = await this.clinicRepository.findById(clinicId);
    if (!clinic) {
      return makeLeft(new ClinicNotFoundError());
    }

    // Preparação de dados
    const cpfVO = Cpf.create(cpf);
    const emailVO = Email.create(email);

    // Execução dentro da transação
    const result = await this.transactionManager.run(
      async (tx) => {
        const user = User.create({
          name,
          cpf: cpfVO,
          email: emailVO,
          password: "TEMPORARY_PASSWORD_PLACEHOLDER", // Placeholder, will be set via email link
          role: UserRole.member(),
        });

        await this.usersRepository.create(user, tx);

        const patient = Patient.create({
          clinicId: new UniqueEntityId(clinicId),
          userId: user.id,
          name,
          birthDay,
          address,
          zipCode,
        });

        await this.patientRepository.create(patient, tx);

        const clinicMembership = ClinicMembership.create({
          userId: user.id,
          clinicId: new UniqueEntityId(clinicId),
          role: ClinicRole.patient(),
        });
        await this.clinicMembershipRepository.create(clinicMembership, tx);

        return makeRight({ patient, user, email: emailVO.getValue() });
      }
    );

    // Emite o evento apenas se a transação foi bem-sucedida
    if (isRight(result)) {
      const { patient, user, email } = unwrapEither(result);

      this.eventEmitter.emit(
        'patient.created',
        new PatientCreatedEvent(
          patient.id.toString(),
          user.id.toString(),
          clinicId,
          clinic.slug.getValue(),
          email,
        )
      );

      // Retorna apenas o patient (sem os dados temporários)
      return makeRight({ patient });
    }

    return result;
  }
}
