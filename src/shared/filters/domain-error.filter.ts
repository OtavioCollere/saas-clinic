import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from "@nestjs/common";
import { DomainError } from "../errors/domain-error";

@Catch(DomainError)
export class DomainErrorFilter implements ExceptionFilter {
  catch(exception: DomainError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status = 400;
    const message = exception.message;

    response.status(status).json({
      statusCode: status,
      message,
      error: "Bad Request",
    });
  }
}

