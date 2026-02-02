import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import { ProfessionalNotFoundError } from '@/shared/errors/professional-not-found-error';
import type { Professional } from '@/domain/enterprise/entities/professional';
import type { ProfessionalRepository } from '../../repositories/professional-repository';

interface GetProfessionalUseCaseRequest {
  professionalId: string;
}

type GetProfessionalUseCaseResponse = Either<
  ProfessionalNotFoundError,
  { professional: Professional }
>;

export class GetProfessionalUseCase {
  constructor(private professionalRepository: ProfessionalRepository) {}

  async execute({
    professionalId,
  }: GetProfessionalUseCaseRequest): Promise<GetProfessionalUseCaseResponse> {
    const professional = await this.professionalRepository.findById(professionalId);

    if (!professional) {
      return makeLeft(new ProfessionalNotFoundError());
    }

    return makeRight({ professional });
  }
}
