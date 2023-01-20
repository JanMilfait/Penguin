import { SerializedError } from '@reduxjs/toolkit';

export type ErrorMessage = {
  message: string
  validationErrors?: { [key: string]: string[] }
}

export type ApiError = {data: ErrorMessage} | SerializedError | undefined;

export const hasErrMessage = (error: ApiError, validationType = ''): error is {data: ErrorMessage} => {
  if (!error || !('data' in error) || !('message' in error.data)) return false;

  if (validationType) {
    if (!error.data.validationErrors || !error.data.validationErrors[validationType]) {
      return false;
    }
  }
  return true;
};