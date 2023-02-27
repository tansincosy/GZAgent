import { toJSON } from '@nestboot/common';
import { NestLoggerService } from '@nsboot/log4js';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { isString } from 'lodash';
import { ExceptionInfo } from '../interceptors/http-response.interface';
/**
 * Http异常过滤器
 * @description 用于处理Http异常
 * @export class HttpExceptionFilter implements ExceptionFilter
 * @class HttpExceptionFilter
 * @implements {ExceptionFilter}
 * @module
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private log?: NestLoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const request = host.switchToHttp().getRequest();
    const response = host.switchToHttp().getResponse();
    const exceptionStatus = exception.getStatus
      ? exception?.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = exception.getResponse
      ? (exception.getResponse() as ExceptionInfo)
      : '';
    const errorMessage = isString(errorResponse)
      ? errorResponse
      : errorResponse.error_message;
    const errorInfo = isString(errorResponse) ? null : errorResponse.error;
    this.log.error(
      'errorResponse is ',
      toJSON(errorResponse),
      HttpExceptionFilter.name,
    );
    const data: any = {
      message: errorMessage,
      code:
        errorInfo?.message ||
        (isString(errorInfo) ? errorInfo : JSON.stringify(errorInfo)),
      debug: errorInfo?.stack || exception.stack,
    };

    // default 404
    if (exceptionStatus === HttpStatus.NOT_FOUND) {
      data.error = data.error || `Not found`;
      data.message =
        data.message || `Invalid API: ${request.method} > ${request.url}`;
    }

    return response.status(errorInfo?.status || exceptionStatus).jsonp(data);
  }
}
