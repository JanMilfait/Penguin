/* eslint-disable @typescript-eslint/no-unused-vars */

type ErrorMessage = { message: string }

const hasErrMessage = (error: unknown, ): error is { data: ErrorMessage } => {
  return error && 'data' in error;
};
