/* eslint-disable no-console */
// TODO: use log level
export default {
  error: (...args: unknown[]) => {
    console.error(
      `[ERROR] [${new Date().toLocaleString()}]:`,
      ...args,
    );
  },
  warn: (...args: unknown[]) => {
    console.warn(`[WARN] [${new Date().toLocaleString()}]:`, ...args);
  },
  info: (...args: unknown[]) => {
    console.log(`[INFO] [${new Date().toLocaleString()}]:`, ...args);
  },
  debug: (...args: unknown[]) => {
    console.log(`[DEBUG] [${new Date().toLocaleString()}]:`, ...args);
  },
};
