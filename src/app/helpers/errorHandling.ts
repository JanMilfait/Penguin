import { SerializedError } from '@reduxjs/toolkit';

export type ApiError = {data: ErrorMessage} | SerializedError | undefined;

export const hasErrMessage = (error: ApiError ): error is {data: ErrorMessage} => {
  if (error === undefined) return false;
  return 'data' in error && 'message' in error.data;
};