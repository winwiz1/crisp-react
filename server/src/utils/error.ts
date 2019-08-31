/**
 * The class CustomError and Express error-handling
 * middleware that uses this class.
 */
import * as Express from "express";
import { logger } from "./logger";

export class CustomError extends Error {
  constructor(readonly status: number, readonly message: string) {
    super(message);
    // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
    Object.setPrototypeOf(this, new.target.prototype);
    if (status <= 200) {
      throw new RangeError(`Invalid CustomError.status: ${status}`);
    }
  }
}

function isError(err: any): err is Error {
  return !!err && err instanceof Error;
}

function isCustomError(err: any): err is CustomError {
  return !!err && err instanceof CustomError && !!(err as CustomError).status;
}

function errorMiddleware(
    err: any,
    _request: Express.Request,
    response: Express.Response,
    next: Express.NextFunction) {
  if (response.headersSent) {
    return next(err);
  }

  if (isCustomError(err)) {
    const status = err.status;
    logger.error({ message: err.message, status });
    response.status(status).type("txt").send(err.message);
  } else if (isError(err)) {
    logger.error({ message: err.message });
    response.status(500).type("txt").send(err.message);
  } else {
    const errMsg = `Unexpected error type: ${typeof err}`;
    logger.error({ message: errMsg });
    throw new TypeError(errMsg);
  }

  next(err);
}

export function handleErrors(app: Express.Application) {
  app.use(errorMiddleware);
}
