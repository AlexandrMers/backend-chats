import { Response } from 'express';

export enum ModelName {
  USER = 'User',
  CHAT = 'Chat',
  MESSAGE = 'Message',
  FILE_UPLOAD = 'FileUpload',
}

export enum Statuses {
  ERROR = 'error',
  SUCCESS = 'success',
}

export type CommonResponseType<SuccessType> = Promise<
  SuccessResponseType<SuccessType> | ErrorResponseType
>;

type SuccessResponseType<T> = Response<{
  status: Statuses.SUCCESS;
  data: T;
}>;

type ErrorResponseType = Response<{
  status: Statuses.ERROR;
  message: string;
}>;
