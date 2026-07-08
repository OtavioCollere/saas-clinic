import { Inject, Injectable } from '@nestjs/common';
import { type Either, makeRight } from '@/shared/either/either';
import type { Procedure } from '@/domain/enterprise/entities/procedure';
import { ProcedureRepository } from '../../repositories/procedure-repository';

interface FetchProceduresByClinicIdUseCaseRequest {
  clinicId: string;
}

type FetchProceduresByClinicIdUseCaseResponse = Either<
  never,
  {
    procedures: Procedure[];
  }
>;

@Injectable()
export class FetchProceduresByClinicIdUseCase {
  constructor(
    @Inject(ProcedureRepository)
    private procedureRepository: ProcedureRepository
  ) {}

  async execute({ clinicId }: FetchProceduresByClinicIdUseCaseRequest): Promise<FetchProceduresByClinicIdUseCaseResponse> {
    const procedures = await this.procedureRepository.findByClinicId(clinicId);

    return makeRight({
      procedures,
    });
  }
}

