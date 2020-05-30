/**
 * The Logger.
 * Prints logs (errors only by default) on console and optionally
 * into a file.
 */
import * as Winston from "winston";
import { isGoogleCloudRun} from "./misc";

const logFileName = "server.log";
const isCloudRun = isGoogleCloudRun();
const logDestinations: Winston.LoggerOptions["transports"] =
  [
    // On Cloud Run the console output can go into Stackdriver
    // Logging that could be automatically exported to BigQuery
    new (Winston.transports.Console)(),
  ];

if (!isCloudRun) {
  // On Cloud Run writing into a disk file reduces the available memory
  logDestinations.push(new (Winston.transports.File)({ filename: logFileName }));
}

export const logger = Winston.createLogger({
  format: Winston.format.json({ replacer: undefined, space: 3 }),
  level: "warn",
  transports: logDestinations
});
