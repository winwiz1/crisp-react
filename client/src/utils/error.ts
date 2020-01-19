import logger from "./logger";

/*
  This class allows to have two different error messages describing the same error.
  One user friendly, is meant to be understood by end users. Another detailed and
  possibly containing technical jargon. Support can ask a user to copy the latter
  from the log (currently browser's JS console) and paste into an email to be sent
  to the Support for further troubleshooting.
*/
export class CustomError extends Error {
  constructor(
    message: string,                        // error description for end user
    readonly detailMessage?: string         // error description for logging
  ) {
    super(message);
    // http://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#support-for-newtarget
    Object.setPrototypeOf(this, new.target.prototype);
    this.detailMessage = this.detailMessage ?? "";

    let errStr = message;
    detailMessage && (errStr += `\nInformation for Support:\n${detailMessage || "<no further details>"}`);
    logger.error(errStr);
  }
}
