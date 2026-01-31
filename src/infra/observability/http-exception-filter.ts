import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
  } from '@nestjs/common';
  import { Logger } from 'nestjs-pino';
  
  @Catch() // captura QUALQUER erro lançado no app
  export class HttpExceptionFilter implements ExceptionFilter {
    constructor(
      private readonly logger: Logger,
    ) {}
  
    catch(exception: unknown, host: ArgumentsHost) {
      // Acessa o contexto HTTP (request / response)
      const ctx = host.switchToHttp();
      const request = ctx.getRequest();
      const response = ctx.getResponse();
  
      // Se for HttpException, usa o status dela
      // Senão, assume erro interno (500)
      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : 500;
  
      // Loga o erro com contexto
      this.logger.error(
        {
          err: exception,       // stack trace
          method: request.method,
          url: request.url,
          status,
        },
        'Unhandled exception',
      );
  
      // Resposta padrão para o cliente
      response.status(status).json({
        statusCode: status,
        message: 'Internal server error',
      });
    }
  }
  