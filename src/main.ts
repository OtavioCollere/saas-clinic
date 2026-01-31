import { NestFactory } from "@nestjs/core";
import {
	FastifyAdapter,
	type NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { HttpExceptionFilter } from "./infra/observability/http-exception-filter";

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(),
	);

	const configService = app.get(ConfigService);
	const port = configService.get("PORT") || 3000;

	const config = new DocumentBuilder()
		.setTitle("SaaS Clinic API")
		.setDescription("API para gestão de clínicas de estética")
		.setVersion("1.0")
		.addTag("clinic")
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("api", app, document);

	app.useGlobalFilters(
		app.get(HttpExceptionFilter),
	  );

	await app.listen(port, "0.0.0.0");
}
bootstrap();
