import { Controller, Get, Inject } from "@nestjs/common";
import { PrismaService } from "../../../database/prisma.service";
import { Public } from "@/infra/auth/public";

@Public()
@Controller("health")
export class HealthController {
	constructor(
		@Inject(PrismaService)
		private readonly prisma: PrismaService
	) {}

	@Get()
	async check() {
		try {
			// Verifica se o PrismaService foi injetado corretamente
			if (!this.prisma) {
				return {
					status: "error",
					info: {},
					error: {
						database: {
							status: "down",
							message: "PrismaService is not available",
						},
					},
					details: {
						database: {
							status: "down",
							message: "PrismaService is not available",
						},
					},
				};
			}

			// Verifica conexão com o banco de dados usando $queryRaw
			await this.prisma.$queryRaw`SELECT 1`;

			return {
				status: "ok",
				info: {
					database: {
						status: "up",
					},
				},
				error: {},
				details: {
					database: {
						status: "up",
					},
				},
			};
		} catch (error) {
			return {
				status: "error",
				info: {},
				error: {
					database: {
						status: "down",
						message: error instanceof Error ? error.message : "Unknown error",
					},
				},
				details: {
					database: {
						status: "down",
						message: error instanceof Error ? error.message : "Unknown error",
					},
				},
			};
		}
	}
}

