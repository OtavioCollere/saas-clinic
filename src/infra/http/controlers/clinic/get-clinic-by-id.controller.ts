import { isLeft, unwrapEither } from "@/shared/either/either";
import { ClinicNotFoundError } from "@/shared/errors/clinic-not-found-error";
import { GetClinicByIdUseCase } from "@/domain/application/use-cases/clinic/get-clinic-by-id";
import { Controller, Get, NotFoundException, Param, UsePipes } from "@nestjs/common";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { ClinicPresenter } from "../../presenters/clinic-presenter";

const getClinicByIdParamsSchema = z.object({
	clinicId: z.string(),
});

type GetClinicByIdParamsSchema = z.infer<typeof getClinicByIdParamsSchema>;

const getClinicByIdParamsValidationPipe = new ZodValidationPipe(getClinicByIdParamsSchema);

@Controller("/clinics")
export class GetClinicByIdController {
	constructor(private readonly getClinicByIdUseCase: GetClinicByIdUseCase) {}

	@Get("/:clinicId")
	async handle(@Param(getClinicByIdParamsValidationPipe) params: GetClinicByIdParamsSchema) {
		const { clinicId } = params;

		const result = await this.getClinicByIdUseCase.execute({ clinicId });

		if (isLeft(result)) {
			const error = unwrapEither(result);

			switch (error.constructor) {
				case ClinicNotFoundError:
					throw new NotFoundException(error.message);
				default:
					throw new NotFoundException(error.message);
			}
		}

		const { clinic } = unwrapEither(result);

		return ClinicPresenter.toHTTP(clinic);
	}
}
