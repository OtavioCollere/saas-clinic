import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import { ProfessionalNotFoundError } from '@/shared/errors/professional-not-found-error';
import { UserIsNotOwnerError } from '@/shared/errors/user-is-not-owner-error';
import type { Professional } from '@/domain/enterprise/entities/professional';
import { Council } from '@/domain/enterprise/value-objects/council';
import { Profession } from '@/domain/enterprise/value-objects/profession';
import type { ClinicMembershipRepository } from '../../repositories/clinic-membership-repository';
import type { FranchiseRepository } from '../../repositories/franchise-repository';
import type { ProfessionalRepository } from '../../repositories/professional-repository';

interface EditProfessionalUseCaseRequest {
  professionalId: string;
  editorId: string;
  council?: string;
  councilNumber?: string;
  councilState?: string;
  profession?: string;
}

type EditProfessionalUseCaseResponse = Either<
  ProfessionalNotFoundError | UserIsNotOwnerError,
  {
    professional: Professional;
  }
>;

export class EditProfessionalUseCase {
  constructor(
    private professionalRepository: ProfessionalRepository,
    private franchiseRepository: FranchiseRepository,
    private clinicMembershipRepository: ClinicMembershipRepository
  ) {}

  async execute({
    professionalId,
    editorId,
    council,
    councilNumber,
    councilState,
    profession,
  }: EditProfessionalUseCaseRequest): Promise<EditProfessionalUseCaseResponse> {
    const professional = await this.professionalRepository.findById(professionalId);

    if (!professional) {
      return makeLeft(new ProfessionalNotFoundError());
    }

    const franchise = await this.franchiseRepository.findById(professional.franchiseId.toString());

    if (!franchise) {
      return makeLeft(new ProfessionalNotFoundError());
    }

    const clinicMembership = await this.clinicMembershipRepository.findByUserAndClinic(
      editorId,
      franchise.clinicId.toString()
    );

    if (!clinicMembership || !clinicMembership.role.isOwner()) {
      return makeLeft(new UserIsNotOwnerError());
    }

    if (council) {
      const councilVO = council === 'CRM' ? Council.crm() : Council.crbm();
      professional.council = councilVO;
    }

    if (councilNumber) {
      professional.councilNumber = councilNumber;
    }

    if (councilState) {
      professional.councilState = councilState;
    }

    if (profession) {
      const professionVO = profession === 'MEDICO' ? Profession.medico() : Profession.biomedico();
      professional.profession = professionVO;
    }

    professional.updatedAt = new Date();

    await this.professionalRepository.update(professional);

    return makeRight({ professional });
  }
}
