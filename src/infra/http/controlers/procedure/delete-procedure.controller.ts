import { Inject } from "@nestjs/common";
import { isLeft, unwrapEither } from "@/shared/either/either";
import { ProcedureNotFoundError } from "@/shared/errors/procedure-not-found-error";
import { ProcedureHasAppointmentsError } from "@/shared/errors/procedure-has-appointments-error";
import { DeleteProcedureUseCase } from "@/domain/application/use-cases/procedure/delete-procedure";
import {
	BadRequestException,
	Controller,
	Delete,
	NotFoundException,
	Param,
} from "@nestjs/common";
import {
	ApiBadRequestResponse,
	ApiNoContentResponse,
	ApiNotFoundResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from "@nestjs/swagger";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";

const deleteProcedureParamsSchema = z.object({
	procedureId: z.string(),
});

type DeleteProcedureParamsSchema = z.infer<typeof deleteProcedureParamsSchema>;

const deleteProcedureParamsValidationPipe = new ZodValidationPipe(deleteProcedureParamsSchema);

@ApiTags("Procedures")
@Controller("/procedures")
export class DeleteProcedureController {
	constructor(
		@Inject(DeleteProcedureUseCase)
		private readonly deleteProcedureUseCase: DeleteProcedureUseCase
	) {}

	@Delete("/:procedureId")
	@ApiOperation({
		summary: "Delete procedure",
		description: "Deletes a procedure if it is not linked to any appointments.",
	})
	@ApiParam({
		name: "procedureId",
		type: String,
		description: "Procedure identifier",
	})
	@ApiNoContentResponse({
		description: "Procedure deleted successfully",
	})
	@ApiNotFoundResponse({
		description: "Procedure not found",
	})
	@ApiBadRequestResponse({
		description: "Procedure is linked to appointments",
	})
	async handle(@Param(deleteProcedureParamsValidationPipe) params: DeleteProcedureParamsSchema) {
		const { procedureId } = params;

		const result = await this.deleteProcedureUseCase.execute({ procedureId });

		if (isLeft(result)) {
			const error = unwrapEither(result);

			switch (error.constructor) {
				case ProcedureNotFoundError:
					throw new NotFoundException(error.message);
				case ProcedureHasAppointmentsError:
					throw new BadRequestException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		return;
	}
}



