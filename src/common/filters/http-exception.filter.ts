import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

interface HttpExceptionResponse {
  message: string | string[];
  error?: string;
  [key: string]: any;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;
    let error: string;

    if (exception instanceof HttpException) {
      // Handle NestJS HTTP exceptions
      status = exception.getStatus();
      const errorResponse = exception.getResponse() as HttpExceptionResponse;
      message =
        typeof errorResponse === 'object' && 'message' in errorResponse
          ? Array.isArray(errorResponse.message)
            ? errorResponse.message.join(', ')
            : errorResponse.message.toString()
          : exception.message;
      error =
        typeof errorResponse === 'object' && 'error' in errorResponse
          ? errorResponse.error?.toString() || 'Error'
          : 'Error';
    } else if (exception instanceof QueryFailedError) {
      // Handle TypeORM database errors
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
      error = 'Database Error';
    } else if (exception instanceof Error) {
      // Handle generic Error objects
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message;
      error = exception.name || 'Internal Server Error';
    } else {
      // Handle unknown errors
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      error = 'Unknown Error';
    }

    // Log the error based on severity
    if (status >= 500) {
      this.logger.error(
        `[${request.method}] ${request.url} - ${status}: ${message}`,
        exception instanceof Error ? exception.stack : '',
      );
    } else if (status >= 400) {
      this.logger.warn(
        `[${request.method}] ${request.url} - ${status}: ${message}`,
      );
    }

    // Structure the error response
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