import * as log from "loglevel";
import * as SPAs from "../../config/spa.config";

export class Log {
  private readonly m_title = SPAs.appTitle;
  private readonly m_logger = log.getLogger(this.m_title);

  public trace(message: string) {
    return this.m_logger.trace(message);
  }

  public debug(message: string) {
    return this.m_logger.debug(message);
  }

  public info(message: string) {
    return this.m_logger.info(message);
  }

  public warn(message: string) {
    return this.m_logger.warn(message);
  }

  public error(message: string) {
    return this.m_logger.error(message);
  }
}

export default new Log();
