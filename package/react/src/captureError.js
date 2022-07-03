import { getUserInfo } from "../../utils/src/getUserInfo";
import { getErrorStack } from "../../utils/src/getErrorStack";
import { sendError } from "../../utils/src/sendError";

// export function captureError(error) {
//   const user = window.navigator.userAgent;
// }
// export function captureMessage(message) {
//   const user = window.navigator.userAgent;
// }

export function captureUncaughtException(dsn) {
  window.onerror = async (message, source, lineno, colno, error) => {
    const stack = getErrorStack(error);
    const user = getUserInfo(window.navigator.userAgent);
    const newError = {
      type: error.name,
      message,
      source,
      lineno,
      colno,
      stack,
    };

    await sendError(error, dsn);
  };
}
