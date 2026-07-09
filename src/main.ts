import { NestFactory } from "@nestjs/core";
import {
	FastifyAdapter,
	type NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import cookie from "@fastify/cookie";

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(),
	);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	await app.register(cookie as any);

	const configService = app.get(ConfigService);
	const port = configService.get("PORT") || 3000;

	const configuredOrigins = (process.env.CORS_ORIGINS ?? process.env.APP_URL ?? "")
		.split(",")
		.map((origin) => origin.trim())
		.filter(Boolean);

	const allowedOrigins = new Set([
		"http://localhost:3005",
		"http://localhost:3000",
		"http://127.0.0.1:3005",
		"http://127.0.0.1:3000",
		"https://cliniker.com.br",
		"https://www.cliniker.com.br",
		...configuredOrigins,
	]);
	

	app.enableCors({
		origin: (origin, callback) => {
			if (!origin) {
				callback(null, true);
				return;
			}

			let isAllowedCloudRunOrigin = false;

			try {
				isAllowedCloudRunOrigin = new URL(origin).hostname.endsWith(".run.app");
			} catch {
				isAllowedCloudRunOrigin = false;
			}

			callback(null, allowedOrigins.has(origin) || isAllowedCloudRunOrigin);
		},
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		allowedHeaders: [
			"Content-Type",
			"Authorization",
			"Accept",
			"Origin",
			"X-Requested-With",
			"X-Tenant-ID",
			"x-tenant-id",
		],
		exposedHeaders: ["X-Tenant-ID"],
		credentials: true,
		preflightContinue: false,
		optionsSuccessStatus: 204,
	});



	const config = new DocumentBuilder()
		.setTitle("SaaS Clinic API")
		.setDescription("API para gestão de clínicas de estética")
		.setVersion("1.0")
		.addTag("clinic")
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("api", app, document);

	await app.listen(port, "0.0.0.0");
}
bootstrap();
