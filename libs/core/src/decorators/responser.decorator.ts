import {
  createDecorator,
  HTTP_SUCCESS_MESSAGE,
  USER_PAGINATION,
} from '@nestboot/common';

export const Pagination = () =>
  createDecorator(USER_PAGINATION, { usePaginate: true });

export const Message = (message: string) =>
  createDecorator(HTTP_SUCCESS_MESSAGE, message);
