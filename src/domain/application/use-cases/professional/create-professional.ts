import { Inject, Injectable } from '@nestjs/common';
import { type Either, makeLeft, makeRight, isRight, unwrapEither } from '@/shared/either/either';
import { UniqueEntityId } from '@/shared/entities/unique-entity-id';
import { FranchiseNotFoundError } from '@/shared/errors/franchise-not-found-error';
import { ProfessionalAlreadyExistsError } from '@/shared/errors/professional-already-exists-error';
import { UserIsNotOwnerError } from '@/shared/errors/user-is-not-owner-error';
import { UserNotFoundError } from '@/shared/errors/user-not-found-error';
import { ClinicMembership } from '@/domain/enterprise/entities/clinic-membership';
import { Professional } from '@/domain/enterprise/entities/professional';
import { ClinicRole } from '@/domain/enterprise/value-objects/clinic-role';
import { Council } from '@/domain/enterprise/value-objects/council';
import { Profession } from '@/domain/enterprise/value-objects/profession';
import { ClinicMembershipRepository } from '../../repositories/clinic-membership-repository';
import { FranchiseRepository } from '../../repositories/franchise-repository';
import { ClinicRepository } from '../../repositories/clinic-repository';
import { ProfessionalRepository } from '../../repositories/professional-repository';
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
import { ProfessionalCreatedEvent } from '@/domain/enterprise/events/professional-created.event';

interface CreateProfessionalUseCaseRequest {
  name: string;
	cpf: string;
	email: string;
  franchiseId: string;
  ownerId: string;
  council?: string;
  councilNumber?: string;
  councilState?: string;
  profession: string;
}

type CreateProfessionalUseCaseResponse = Either<
  EmailAlreadyExistsError | CpfAlreadyExistsError | InvalidCpfError | InvalidEmailError | FranchiseNotFoundError | UserIsNotOwnerError,
  {
    professional: Professional;
  }
>;

@Injectable()
export class CreateProfessionalUseCase {
  constructor(
    @Inject(ProfessionalRepository)
    private professionalRepository: ProfessionalRepository,
    @Inject(FranchiseRepository)
    private franchiseRepository: FranchiseRepository,
    @Inject(ClinicRepository)
    private clinicRepository: ClinicRepository,
    @Inject(UsersRepository)
    private usersRepository: UsersRepository,
    @Inject(ClinicMembershipRepository)
    private clinicMembershipRepository: ClinicMembershipRepository,
    @Inject(TransactionManager)
    private transactionManager: TransactionManager,
    @Inject(EventEmitter2)
    private eventEmitter: EventEmitter2,
  ) {}

  async execute({
    name,
    cpf,
    email,
    franchiseId,
    ownerId,
    council,
    councilNumber,
    councilState,
    profession,
  }: CreateProfessionalUseCaseRequest): Promise<CreateProfessionalUseCaseResponse> {
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

    // Validações de franquia e permissões (antes da transação)
    const franchise = await this.franchiseRepository.findById(franchiseId);
    if (!franchise) {
      return makeLeft(new FranchiseNotFoundError());
    }

    const clinic = await this.clinicRepository.findById(franchise.clinicId.toString());
    if (!clinic) {
      return makeLeft(new FranchiseNotFoundError());
    }

    const clinicMembership = await this.clinicMembershipRepository.findByUserAndClinic(
      ownerId,
      franchise.clinicId.toString()
    );

    if (!clinicMembership || !clinicMembership.role.isOwner()) {
      return makeLeft(new UserIsNotOwnerError());
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

        const councilVO = council
          ? (council === 'CRM' ? Council.crm() : Council.crbm())
          : undefined;

        const professionVO =
          profession === 'MEDICO'
            ? Profession.medico()
            : Profession.biomedico();

        const professional = Professional.create({
          franchiseId: new UniqueEntityId(franchiseId),
          userId: user.id,
          council: councilVO,
          councilNumber: councilNumber ?? undefined,
          councilState: councilState ?? undefined,
          profession: professionVO,
        });

        await this.professionalRepository.create(professional, tx);

        const clinicMembership = ClinicMembership.create({
          userId: user.id,
          clinicId: franchise.clinicId,
          role: ClinicRole.professional(),
        });
        await this.clinicMembershipRepository.create(clinicMembership, tx);

        return makeRight({ professional, user, email: emailVO.getValue() });
      }
    );

    // Emite o evento apenas se a transação foi bem-sucedida
    if (isRight(result)) {
      const { professional, user, email } = unwrapEither(result);

      this.eventEmitter.emit(
        'professional.created',
        new ProfessionalCreatedEvent(
          professional.id.toString(),
          user.id.toString(),
          franchiseId,
          clinic.slug.getValue(),
          email,
        )
      );

      // Retorna apenas o professional (sem os dados temporários)
      return makeRight({ professional });
    }

    return result;
  }
}