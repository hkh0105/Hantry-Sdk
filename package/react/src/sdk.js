import { captureUncaughtException, onUnhandledRejection } from "./captureError";
export const init = (dsn, options) => {
  captureUncaughtException(dsn);
  onUnhandledRejection(dsn);
};
