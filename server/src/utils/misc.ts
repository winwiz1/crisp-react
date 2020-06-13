import * as fs from "fs";

// Get the port that Express should be listening on
export function getListeningPort(): number {
  const port = parseInt(process.env.PORT || "3000", 10);
  return port;
}

// Returns true if running on Google Cloud Run.
// Assumption: the port 8080 is reserved for Cloud Run.
export function isGoogleCloudRun(): boolean {
  return getListeningPort() === 8080;
}

export function isTest(): boolean {
  return process.env.NODE_ENV === "test";
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

export function useProxy(): boolean {
  const ret = parseInt(process.env.BEHIND_PROXY || "0", 10);
  return ret === 1;
}

export function isDocker(): boolean {
  try {
    fs.statSync("/.dockerenv");
    return true;
  } catch {
    try {
      fs.statSync("/.dockerinit");
      return true;
    } catch {
      return false;
    }
  }
}

