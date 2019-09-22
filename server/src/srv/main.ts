/**
 * Code responsible for Express instantiation.
 */
import Server from "./server";
import { logger } from "../utils/logger";

const port = parseInt(process.env.PORT || "3000", 10);
const server = Server();

server.listen(port, () => {
  logger.info({ message: `server started at http://localhost:${port}` });
});
