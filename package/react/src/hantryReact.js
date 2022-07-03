import { Hantry } from "../../core/src/hantry";
import { getUserInfo } from "../../utils/src/getUserInfo";
import { getErrorStack } from "../../utils/src/getErrorStack";

export class HantryReact extends Hantry {
  constructor(dsn, options) {
    this.platform = "react";
  }

  captureUncaughtException() {
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
        user,
      };

      return await this.createError(newError, this.dsn);
    };
  }

  onUnhandledRejection() {
    window.onunhandledrejection = async event => {
      const stack = getErrorStack(event.reason);
      const user = getUserInfo(window.navigator.userAgent);
      const newError = {
        type: "Rejection Error",
        message: event.reason,
        stack,
        user,
      };

      return await this.createError(newError, this.dsn);
    };
  }
}
