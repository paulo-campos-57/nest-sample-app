/*
This file defines the HttpExceptionFilter class, which implements the
ExceptionFilter interface to provide centralized error handling for the application.

The filter captures all exceptions thrown during the request lifecycle,
including both HTTP exceptions (such as BadRequestException and
NotFoundException) and unexpected runtime errors.

For HTTP exceptions, the filter extracts the status code and message
from the exception object. For unknown errors, it returns a generic
500 Internal Server Error response.

The filter formats all error responses using a consistent JSON structure
that includes the status code, timestamp, request path, HTTP method,
error type, and message.

By registering this filter globally in the main.ts file, the application
ensures that all errors are handled in a standardized way, eliminating
the need for repetitive try/catch blocks in controllers.
*/
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const responseObject = exceptionResponse as {
          message?: string | string[];
          error?: string;
        };

        if (Array.isArray(responseObject.message)) {
          message = responseObject.message.join(', ');
        } else if (responseObject.message) {
          message = responseObject.message;
        }

        if (responseObject.error) {
          error = responseObject.error;
        }
      }
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error,
      message,
    });
  }
}
