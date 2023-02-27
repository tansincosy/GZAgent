import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

import {
  HttpResponsePagination,
  HttpResponseSuccess,
} from './http-response.interface';
import {
  getDecoratorValue,
  HTTP_SUCCESS_MESSAGE,
  USER_PAGINATION,
} from '@nestboot/common';

/**
 * 请求成功转换器
 */
@Injectable()
export class TransformInterceptor<T>
  implements
    NestInterceptor<T, T | HttpResponseSuccess<T> | HttpResponsePagination<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<T | HttpResponseSuccess<T>> {
    const call$ = next.handle();
    const target = context.getHandler();
    const successMessage = getDecoratorValue(HTTP_SUCCESS_MESSAGE, target);
    const usePaginate = getDecoratorValue(USER_PAGINATION, target);

    return call$.pipe(
      map((data: any) => {
        const result = usePaginate
          ? {
              data: data.data,
              success: true,
              total: data.total,
              page_size: data.pageSize,
              page_number: data.pageNumber,
            }
          : data;

        return {
          message: successMessage || 'request succeed',
          code: '',
          ...result,
        };
      }),
    );
  }
}
