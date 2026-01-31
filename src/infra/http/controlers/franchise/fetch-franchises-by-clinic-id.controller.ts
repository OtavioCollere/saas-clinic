import { isLeft, unwrapEither } from "@/shared/either/either";
import { ClinicNotFoundError } from "@/shared/errors/clinic-not-found-error";
import { FetchFranchisesByClinicIdUseCase } from "@/domain/application/use-cases/franchise/fetch-franchises-by-clinic-id";
import { Controller, Get, NotFoundException, Param, UsePipes } from "@nestjs/common";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { FranchisePresenter } from "../../presenters/franchise-presenter";

const fetchFranchisesByClinicIdParamsSchema = z.object({
	clinicId: z.string(),
});

type FetchFranchisesByClinicIdParamsSchema = z.infer<typeof fetchFranchisesByClinicIdParamsSchema>;

const fetchFranchisesByClinicIdParamsValidationPipe = new ZodValidationPipe(fetchFranchisesByClinicIdParamsSchema);

@Controller("/clinics")
export class FetchFranchisesByClinicIdController {
	constructor(private readonly fetchFranchisesByClinicIdUseCase: FetchFranchisesByClinicIdUseCase) {}

	@Get("/:clinicId/franchises")
	async handle(@Param(fetchFranchisesByClinicIdParamsValidationPipe) params: FetchFranchisesByClinicIdParamsSchema) {
		const { clinicId } = params;

		const result = await this.fetchFranchisesByClinicIdUseCase.execute({ clinicId });

		if (isLeft(result)) {
			const error = unwrapEither(result);

			switch (error.constructor) {
				case ClinicNotFoundError:
					throw new NotFoundException(error.message);
				default:
					throw new NotFoundException(error.message);
			}
		}

		const { franchises } = unwrapEither(result);

		return franchises.map(FranchisePresenter.toHTTP);
	}
}
