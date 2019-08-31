/**
 * The Logger.
 * Prints logs (errors only) on console.
 */
import * as winston from "winston";

export const logger = winston.createLogger({
  format: winston.format.simple(),
  level: "error",
  transports: [
    new (winston.transports.Console)(),
  ]
});
