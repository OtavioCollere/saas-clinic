import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../../../database/prisma.service";

@Controller("health")
export class HealthController {
	constructor(private readonly prisma: PrismaService) {}

	@Get()
	async check() {
		try {
			// Verifica conexão com o banco de dados usando $queryRaw
			await (this.prisma as any).$queryRaw`SELECT 1`;

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

