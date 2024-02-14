const levels: Record<string, number> = {
  error: 70,
  warn: 60,
  info: 50,
  debug: 30,
  trace: 20,
};

const logger = console;
const logLevel =
  -1 + (levels[import.meta.env.LOG_LEVEL || "info"] || 50);

export default {
  error: (...args: unknown[]) => {
    if (logLevel > levels.error) {
      return;
    }
    logger.error(
      `[ERROR] [${new Date().toLocaleString()}]:`,
      ...args,
    );
  },
  warn: (...args: unknown[]) => {
    if (logLevel > levels.warn) {
      return;
    }
    logger.warn(`[WARN] [${new Date().toLocaleString()}]:`, ...args);
  },
  info: (...args: unknown[]) => {
    if (logLevel > levels.info) {
      return;
    }
    logger.info(`[INFO] [${new Date().toLocaleString()}]:`, ...args);
  },
  debug: (...args: unknown[]) => {
    if (logLevel > levels.debug) {
      return;
    }
    logger.debug(
      `[DEBUG] [${new Date().toLocaleString()}]:`,
      ...args,
    );
  },
  trace: (...args: unknown[]) => {
    if (logLevel > levels.trace) {
      return;
    }
    logger.trace(
      `[DEBUG] [${new Date().toLocaleString()}]:`,
      ...args,
    );
  },
};
