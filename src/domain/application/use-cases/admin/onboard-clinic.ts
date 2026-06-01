import { Inject, Injectable } from '@nestjs/common';
import { type Either, makeLeft, makeRight, isRight } from '@/shared/either/either';
import { UniqueEntityId } from '@/shared/entities/unique-entity-id';
import { Clinic } from '@/domain/enterprise/entities/clinic';
import { ClinicMembership } from '@/domain/enterprise/entities/clinic-membership';
import { ClinicRole } from '@/domain/enterprise/value-objects/clinic-role';
import { User } from '@/domain/enterprise/entities/user';
import { UserRole } from '@/domain/enterprise/value-objects/user-role';
import { Cpf } from '@/domain/enterprise/value-objects/cpf';
import { Email } from '@/domain/enterprise/value-objects/email';
import { Cnpj } from '@/domain/enterprise/value-objects/cnpj';
import { Slug } from '@/domain/enterprise/value-objects/slug';
import { Franchise } from '@/domain/enterprise/entities/franchise';
import { FranchiseStatus } from '@/domain/enterprise/value-objects/franchise-status';
import { Professional } from '@/domain/enterprise/entities/professional';
import { Profession } from '@/domain/enterprise/value-objects/profession';
import { Council } from '@/domain/enterprise/value-objects/council';
import { ClinicOwnerOnboardedEvent } from '@/domain/enterprise/events/clinic-owner-onboarded.event';
import { ProfessionalCreatedEvent } from '@/domain/enterprise/events/professional-created.event';
import { ClinicRepository } from '../../repositories/clinic-repository';
import { ClinicMembershipRepository } from '../../repositories/clinic-membership-repository';
import { UsersRepository } from '../../repositories/users-repository';
import { FranchiseRepository } from '../../repositories/franchise-repository';
import { ProfessionalRepository } from '../../repositories/professional-repository';
import { TransactionManager } from '../../transactions/transaction-manager';
import { HashGenerator } from '../../cryptography/hash-generator';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EmailAlreadyExistsError } from '@/shared/errors/email-already-exists-error';
import { CpfAlreadyExistsError } from '@/shared/errors/cpf-already-exists-error';
import { InvalidCpfError } from '@/shared/errors/invalid-cpf-error';
import { InvalidEmailError } from '@/shared/errors/invalid-email-error';
import { InvalidCnpjError } from '@/shared/errors/invalid-cnpj-error';
import { CnpjAlreadyExistsError } from '@/shared/errors/cnpj-already-exists-error';
import { ClinicAlreadyExistsError } from '@/shared/errors/clinic-already-exists-error';
import crypto from 'crypto';

interface FranchiseInput {
  name: string;
  address: string;
  zipCode: string;
  description?: string;
}

interface ProfessionalInput {
  name: string;
  cpf: string;
  email: string;
  franchiseIndex: number;
  profession: string;
  council?: string;
  councilNumber?: string;
  councilState?: string;
}

interface OnboardClinicRequest {
  clinicName: string;
  cnpj: string;
  ownerName: string;
  ownerCpf: string;
  ownerEmail: string;
  franchises?: FranchiseInput[];
  professionals?: ProfessionalInput[];
}

interface CreatedProfessionalData {
  professionalId: string;
  userId: string;
  franchiseId: string;
  email: string;
  password: string;
  passwordExpiresAt: Date;
}

type OnboardClinicResponse = Either<
  | InvalidEmailError
  | InvalidCpfError
  | InvalidCnpjError
  | EmailAlreadyExistsError
  | CpfAlreadyExistsError
  | CnpjAlreadyExistsError
  | ClinicAlreadyExistsError,
  { clinicId: string; clinicSlug: string; userId: string; email: string }
>;

@Injectable()
export class OnboardClinicUseCase {
  constructor(
    @Inject(ClinicRepository)
    private clinicRepository: ClinicRepository,
    @Inject(ClinicMembershipRepository)
    private clinicMembershipRepository: ClinicMembershipRepository,
    @Inject(UsersRepository)
    private usersRepository: UsersRepository,
    @Inject(FranchiseRepository)
    private franchiseRepository: FranchiseRepository,
    @Inject(ProfessionalRepository)
    private professionalRepository: ProfessionalRepository,
    @Inject(TransactionManager)
    private transactionManager: TransactionManager,
    @Inject(HashGenerator)
    private hashGenerator: HashGenerator,
    @Inject(EventEmitter2)
    private eventEmitter: EventEmitter2,
  ) {}

  async execute({ clinicName, cnpj, ownerName, ownerCpf, ownerEmail, franchises = [], professionals = [] }: OnboardClinicRequest): Promise<OnboardClinicResponse> {
    if (!Email.isValid(ownerEmail)) return makeLeft(new InvalidEmailError());
    if (!Cpf.isValid(ownerCpf)) return makeLeft(new InvalidCpfError());
    if (!Cnpj.isValid(cnpj)) return makeLeft(new InvalidCnpjError());

    if (await this.usersRepository.findByEmail(ownerEmail)) return makeLeft(new EmailAlreadyExistsError());
    if (await this.usersRepository.findByCpf(ownerCpf)) return makeLeft(new CpfAlreadyExistsError());
    if (await this.clinicRepository.findByCnpj(cnpj)) return makeLeft(new CnpjAlreadyExistsError());

    const slug = Slug.create(clinicName);
    if (await this.clinicRepository.findBySlug(slug.getValue())) return makeLeft(new ClinicAlreadyExistsError());

    // Validate professional emails/CPFs before transaction
    for (const prof of professionals) {
      if (!Email.isValid(prof.email)) return makeLeft(new InvalidEmailError());
      if (!Cpf.isValid(prof.cpf)) return makeLeft(new InvalidCpfError());
      if (await this.usersRepository.findByEmail(prof.email)) return makeLeft(new EmailAlreadyExistsError());
      if (await this.usersRepository.findByCpf(prof.cpf)) return makeLeft(new CpfAlreadyExistsError());
    }

    const ownerRandomPassword = crypto.randomBytes(16).toString('hex');
    const ownerPasswordHash = await this.hashGenerator.hash(ownerRandomPassword);
    const ownerPasswordExpiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000);

    // Pre-hash professional passwords
    const profPasswords: { plain: string; hash: string; expiresAt: Date }[] = [];
    for (const _prof of professionals) {
      const plain = crypto.randomBytes(16).toString('hex');
      const hash = await this.hashGenerator.hash(plain);
      profPasswords.push({ plain, hash, expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000) });
    }

    const cpfVO = Cpf.create(ownerCpf);
    const emailVO = Email.create(ownerEmail);
    const cnpjVO = Cnpj.create(cnpj);

    const result = await this.transactionManager.run(async (tx) => {
      const owner = User.create({
        name: ownerName,
        cpf: cpfVO,
        email: emailVO,
        password: ownerPasswordHash,
        role: UserRole.member(),
      });
      await this.usersRepository.create(owner, tx);

      const clinic = Clinic.create({
        name: clinicName,
        ownerId: owner.id,
        cnpj: cnpjVO,
      });
      await this.clinicRepository.create(clinic, tx);

      const ownerMembership = ClinicMembership.create({
        userId: owner.id,
        clinicId: clinic.id,
        role: ClinicRole.owner(),
      });
      await this.clinicMembershipRepository.create(ownerMembership, tx);

      // Create franchises
      const createdFranchises: Franchise[] = [];
      for (const franchiseInput of franchises) {
        const franchise = Franchise.create({
          clinicId: clinic.id,
          name: franchiseInput.name,
          address: franchiseInput.address,
          zipCode: franchiseInput.zipCode,
          description: franchiseInput.description,
          status: FranchiseStatus.active(),
        });
        const saved = await this.franchiseRepository.create(franchise, tx);
        createdFranchises.push(saved);
      }

      // Create professionals
      const createdProfessionalsData: CreatedProfessionalData[] = [];
      for (let i = 0; i < professionals.length; i++) {
        const profInput = professionals[i];
        const profPw = profPasswords[i];
        const targetFranchise = createdFranchises[profInput.franchiseIndex] ?? createdFranchises[0];
        if (!targetFranchise) continue;

        const profCpf = Cpf.create(profInput.cpf);
        const profEmail = Email.create(profInput.email);

        const profUser = User.create({
          name: profInput.name,
          cpf: profCpf,
          email: profEmail,
          password: profPw.hash,
          role: UserRole.member(),
        });
        await this.usersRepository.create(profUser, tx);

        const councilVO = profInput.council
          ? (profInput.council === 'CRM' ? Council.crm() : Council.crbm())
          : undefined;

        const professionVO = profInput.profession === 'MEDICO' ? Profession.medico() : Profession.biomedico();

        const professional = Professional.create({
          franchiseId: targetFranchise.id,
          userId: profUser.id,
          council: councilVO,
          councilNumber: profInput.councilNumber,
          councilState: profInput.councilState,
          profession: professionVO,
        });
        const savedProf = await this.professionalRepository.create(professional, tx);

        const profMembership = ClinicMembership.create({
          userId: profUser.id,
          clinicId: clinic.id,
          role: ClinicRole.professional(),
        });
        await this.clinicMembershipRepository.create(profMembership, tx);

        createdProfessionalsData.push({
          professionalId: savedProf.id.toString(),
          userId: profUser.id.toString(),
          franchiseId: targetFranchise.id.toString(),
          email: profEmail.getValue(),
          password: profPw.plain,
          passwordExpiresAt: profPw.expiresAt,
        });
      }

      return makeRight({
        clinicId: clinic.id.toString(),
        clinicSlug: slug.getValue(),
        userId: owner.id.toString(),
        email: emailVO.getValue(),
        createdProfessionalsData,
      });
    });

    if (isRight(result)) {
      const { clinicId, clinicSlug, userId, email, createdProfessionalsData } = result.value;

      this.eventEmitter.emit(
        'clinic-owner.onboarded',
        new ClinicOwnerOnboardedEvent(userId, clinicId, clinicName, clinicSlug, email, ownerRandomPassword, ownerPasswordExpiresAt),
      );

      for (const profData of createdProfessionalsData) {
        this.eventEmitter.emit(
          'professional.created',
          new ProfessionalCreatedEvent(
            profData.professionalId,
            profData.userId,
            profData.franchiseId,
            clinicSlug,
            profData.email,
            profData.password,
            profData.passwordExpiresAt,
          ),
        );
      }

      return makeRight({ clinicId, clinicSlug, userId, email });
    }

    return result as OnboardClinicResponse;
  }
}
