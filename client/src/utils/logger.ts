import debug from "debug";
import * as SPAs from "../../config/spa.config";

const enum LOG_LEVEL {
  LOG_TRACE,
  LOG_INFO,
  LOG_WARN,
  LOG_ERROR
}

export class Log {
  private readonly BASE = SPAs.appTitle;

  private generateMessage(level: LOG_LEVEL, message: string, source?: string) {
    const namespace = `${this.BASE}:${level}`;
    const logger: debug.Debugger = debug(namespace);

    if (source) {
      logger(source, message);
    } else {
      logger(message);
    }
  }

  public trace(message: string, source?: string) {
    return this.generateMessage(LOG_LEVEL.LOG_TRACE, message, source);
  }

  public info(message: string, source?: string) {
    return this.generateMessage(LOG_LEVEL.LOG_INFO, message, source);
  }

  public warn(message: string, source?: string) {
    return this.generateMessage(LOG_LEVEL.LOG_WARN, message, source);
  }

  public error(message: string, source?: string) {
    return this.generateMessage(LOG_LEVEL.LOG_ERROR, message, source);
  }
}

export default new Log();
