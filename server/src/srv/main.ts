/**
 * Code responsible for Express instantiation.
 */
import Server from "./server";
import { logger } from "../utils/logger";
import { getListeningPort } from "../utils/misc";

const port = getListeningPort();
const server = Server();

const instance = server.listen(port, () => {
  logger.info({ message: `Server started, port: ${port}` });
});

process.on("SIGTERM", function () {
  instance.close(function () {
    logger.warn({ message: "Server terminated" });
    process.exit(0);
  });
});
