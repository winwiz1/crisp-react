/**
 * Code responsible for Express instantiation.
 */
import Server from "./server";
import { logger } from "../utils/logger";
import { getListeningPort } from "../utils/misc";

const port = getListeningPort();
const server = Server();

server.listen(port, () => {
  logger.info({ message: `Server started, port: ${port}` });
});
