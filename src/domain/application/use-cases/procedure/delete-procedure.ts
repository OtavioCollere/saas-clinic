import { Inject, Injectable } from '@nestjs/common';
import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import { ProcedureNotFoundError } from '@/shared/errors/procedure-not-found-error';
import { ProcedureHasAppointmentsError } from '@/shared/errors/procedure-has-appointments-error';
import { ProcedureRepository } from '../../repositories/procedure-repository';

interface DeleteProcedureUseCaseRequest {
  procedureId: string;
}

type DeleteProcedureUseCaseResponse = Either<
  ProcedureNotFoundError | ProcedureHasAppointmentsError,
  void
>;

@Injectable()
export class DeleteProcedureUseCase {
  constructor(
    @Inject(ProcedureRepository)
    private procedureRepository: ProcedureRepository
  ) {}

  async execute({
    procedureId,
  }: DeleteProcedureUseCaseRequest): Promise<DeleteProcedureUseCaseResponse> {
    const procedure = await this.procedureRepository.findById(procedureId);

    if (!procedure) {
      return makeLeft(new ProcedureNotFoundError());
    }

    const hasAppointments = await this.procedureRepository.hasAppointments(procedureId);

    if (hasAppointments) {
      return makeLeft(new ProcedureHasAppointmentsError());
    }

    await this.procedureRepository.delete(procedureId);

    return makeRight(undefined);
  }
}



