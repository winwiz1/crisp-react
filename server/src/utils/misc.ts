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
