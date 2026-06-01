import { Inject, Injectable } from "@nestjs/common";
import { type Either, makeRight } from "@/shared/either/either";
import { ProcedureSupplyTemplateRepository } from "../../repositories/procedure-supply-template-repository";
import type { ProcedureSupplyTemplate } from "@/domain/enterprise/entities/procedure-supply-template";

interface Request { procedureId: string }
type Response = Either<never, { templates: ProcedureSupplyTemplate[] }>;

@Injectable()
export class ListProcedureSupplyTemplatesUseCase {
  constructor(
    @Inject(ProcedureSupplyTemplateRepository)
    private templateRepository: ProcedureSupplyTemplateRepository,
  ) {}

  async execute({ procedureId }: Request): Promise<Response> {
    const templates = await this.templateRepository.findByProcedureId(procedureId);
    return makeRight({ templates });
  }
}
