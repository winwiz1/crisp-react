/**
 * The class CustomError and Express error-handling
 * middleware that uses this class.
 */
import * as Express from "express";
import { logger } from "./logger";
import { isTest } from "./misc";

/*
  The class allows to have two different error messages describing the same error.
  On the one hand we would like to log all the error details for troubleshooting,
  auditing etc. On the other hand the error description also needs to be sent to
  the user. Having two wordings for the same issue allows to avoid a possible XSS
  reflection. The added benefit of this approach is the ability to keep logs
  detailed while sparing the end users from seeing the technical details and
  unfamiliar terminology.
*/
export class CustomError extends Error {
  constructor(
      // HTTP status code
      readonly status: number,
      // Error message sent to client and obscured/sanitised to avoid possible XSS
      message: string,
      // Optional logging tuple. The first boolean tells the error-handling
      // middleware if the Request needs to be logged. The second boolean controls
      // Response logging.
      ...loggingTuple: [boolean?, boolean?]) {
    super(message);
    // http://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#support-for-newtarget
    Object.setPrototypeOf(this, new.target.prototype);
    if (status <= 200) {
      throw new RangeError(`Invalid CustomError.status: ${status}`);
    }
    // save the tuple that comes as rest parameter
    loggingTuple.length > 0 && (this.m_loggingTuple[0] = loggingTuple[0]!);
    loggingTuple.length === 2 && (this.m_loggingTuple[1] = loggingTuple[1]!);
  }

  get unobscuredMessage(): string | undefined {
    return this.m_unobscuredMsg;
  }
  set unobscuredMessage(val: string | undefined) {
    this.m_unobscuredMsg = val;
  }

  get logOnly(): boolean {
    return this.m_logOnly;
  }
  set logOnly(val: boolean) {
    this.m_logOnly = val;
  }

  // Unobscured error message, might contain error details reflecting
  // attempted XSS, used for logging
  private m_unobscuredMsg: string | undefined = undefined;

  // If true then no response is sent by error-handling middleware
  private m_logOnly: boolean = false;

  readonly m_loggingTuple: [boolean, boolean] = [true, true];
}

export function isError(err: any): err is Error {
  return !!err && err instanceof Error && err.constructor !== CustomError;
}

export function isCustomError(err: any): err is CustomError {
  return !!err && err.constructor === CustomError;
}

/*
  Error-handling middleware
*/
function errorMiddleware(
  err: any,
  request: Express.Request,
  response: Express.Response,
  next: Express.NextFunction) {

  if (response.headersSent) {
    return next(err);
  }

  if (isCustomError(err)) {
    const status = err.status;
    isTest() || logger.error({
      message: "ErrorMessage: " + (err.unobscuredMessage ?? err.message) + "\n",
      ...(err.m_loggingTuple[0] && request),
      ...(err.m_loggingTuple[1] && response)
    });
    if (!err.logOnly) {
      response.status(status).type("txt").send(err.message);
    }
  } else if (isError(err)) {
    logger.error({
      message: "ErrorMessage: " + err.message + "\n",
      request,
      response });
    response.status(500).type("txt").send(err.message);
  } else {
    const errMsg = `Unexpected error type: ${typeof err}`;
    logger.error({
      message: errMsg + "\n",
      request,
      response });
    throw new TypeError(errMsg);
  }

  next(err);
}

export function handleErrors(app: Express.Application) {
  app.use(errorMiddleware);
}
