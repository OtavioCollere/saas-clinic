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
  
      // Se for HttpException, pega a resposta do erro
      // Senão, usa mensagem padrão
      const message =
        exception instanceof HttpException
          ? exception.getResponse()
          : 'Internal server error';
  
      // Loga o erro com contexto
      if (exception instanceof HttpException) {
        // Para erros HTTP conhecidos, loga como warn ou error dependendo do status
        if (status >= 500) {
          this.logger.error(
            {
              err: exception,
              method: request.method,
              url: request.url,
              status,
              body: request.body,
            },
            'HTTP error',
          );
        } else {
          this.logger.warn(
            {
              method: request.method,
              url: request.url,
              status,
              message,
            },
            'HTTP client error',
          );
        }
      } else {
        // Para erros não tratados, sempre loga como error
        this.logger.error(
          {
            err: exception,
            method: request.method,
            url: request.url,
            status,
            body: request.body,
          },
          'Unhandled exception',
        );
      }
  
      // Resposta para o cliente
      response.status(status).json(
        typeof message === 'string'
          ? {
              statusCode: status,
              message,
            }
          : message,
      );
    }
  }
  