import { Hantry } from "hantry-js-core";
import { getUserInfo } from "hantry-js-utils";
import { getErrorStack } from "hantry-js-utils";

export class HantryReact extends Hantry {
  constructor(dsn, options) {
    super(dsn, options);
    this.platform = "react";
  }

  captureUncaughtException() {
    window.onerror = async (message, source, lineno, colno, error) => {
      console.log(
        "message:",
        message,
        "src:",
        source,
        "lii:",
        lineno,
        "co:",
        colno,
        "err:",
        error,
      );
      const stack = getErrorStack(error);
      console.log("stack:", stack);
      console.log("windowuser", window.navigator.userAgent);
      const user = getUserInfo(window.navigator.userAgent);
      console.log("user:", user);
      const newError = {
        type: error.name,
        message,
        source,
        lineno,
        colno,
        stack,
        user,
      };

      return await super.createError(newError, this.dsn);
    };
  }

  onUnhandledRejection() {
    window.onunhandledrejection = async event => {
      console.log("event", event, "event re", event.reason);
      // const stack = getErrorStack(event.reason);
      const user = getUserInfo(window.navigator.userAgent);
      const newError = {
        type: "Rejection Error",
        message: event.reason,
        // stack,
        user,
      };
      console.log(newError);
      // return await super.createError(newError, this.dsn);
    };
  }
}
