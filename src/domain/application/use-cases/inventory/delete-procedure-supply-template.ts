import { Inject, Injectable } from "@nestjs/common";
import { type Either, makeLeft, makeRight } from "@/shared/either/either";
import { ProcedureSupplyTemplateRepository } from "../../repositories/procedure-supply-template-repository";
import { ProcedureSupplyTemplateNotFoundError } from "@/shared/errors/procedure-supply-template-not-found-error";

interface Request { id: string }
type Response = Either<ProcedureSupplyTemplateNotFoundError, null>;

@Injectable()
export class DeleteProcedureSupplyTemplateUseCase {
  constructor(
    @Inject(ProcedureSupplyTemplateRepository)
    private templateRepository: ProcedureSupplyTemplateRepository,
  ) {}

  async execute({ id }: Request): Promise<Response> {
    const template = await this.templateRepository.findById(id);
    if (!template) return makeLeft(new ProcedureSupplyTemplateNotFoundError());
    await this.templateRepository.delete(id);
    return makeRight(null);
  }
}
