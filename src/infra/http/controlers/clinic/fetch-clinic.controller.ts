import { isLeft, unwrapEither } from "@/core/either/either";
import type { FetchClinicUseCase } from "@/domain/application/use-cases/clinic/fetch-clinic";
import { Controller, Get, Query, UsePipes } from "@nestjs/common";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { ClinicPresenter } from "../presenters/clinic-presenter";

const fetchClinicQuerySchema = z.object({
	page: z.coerce.number().int().positive(),
	pageSize: z.coerce.number().int().positive().optional(),
	query: z.string().optional(),
});

type FetchClinicQuerySchema = z.infer<typeof fetchClinicQuerySchema>;

const fetchClinicQueryValidationPipe = new ZodValidationPipe(fetchClinicQuerySchema);

@Controller("/clinics")
export class FetchClinicController {
	constructor(private readonly fetchClinicUseCase: FetchClinicUseCase) {}

	@Get()
	async handle(@Query(fetchClinicQueryValidationPipe) query: FetchClinicQuerySchema) {
		const { page, pageSize, query: searchQuery } = query;

		const result = await this.fetchClinicUseCase.execute({
			page,
			pageSize,
			query: searchQuery,
		});

		if (isLeft(result)) {
			const error = unwrapEither(result);
			throw new Error(error.message);
		}

		const { clinics } = unwrapEither(result);

		return clinics.map(ClinicPresenter.toHTTP);
	}
}
