import { Hantry } from "hantry-js-core";
import { getUserInfo } from "hantry-js-utils";
import { getErrorStack } from "hantry-js-utils";

export class HantryReact extends Hantry {
  constructor(dsn, options) {
    super(dsn, options);
    this.platform = "react";
    this.breadcrumbs = [];
  }

  captureClickEvent() {
    window.addEventListener("click", event => {
      event.preventDefault();
      this.breadcrumbs.push(event.target.innerHTML);
    });
  }

  captureUriChange() {
    let oldPushState = history.pushState;
    history.pushState = function pushState() {
      let ret = oldPushState.apply(this, arguments);

      window.dispatchEvent(new Event("pushstate"));
      window.dispatchEvent(new Event("locationchange"));

      return ret;
    };

    let oldReplaceState = history.replaceState;
    history.replaceState = function replaceState() {
      let ret = oldReplaceState.apply(this, arguments);

      window.dispatchEvent(new Event("replacestate"));
      window.dispatchEvent(new Event("locationchange"));

      return ret;
    };

    window.addEventListener("popstate", () => {
      window.dispatchEvent(new Event("locationchange"));
    });

    window.addEventListener("locationchange", () => {
      this.breadcrumbs.push(window.location.href);
    });
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
        breadcrumbs: this.breadcrumbs,
      };

      this.breadcrumbs = [];
      return await super.createError(newError, this.dsn);
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
        breadcrumbs: this.breadcrumbs,
      };

      this.breadcrumbs = [];
      return await super.createError(newError, this.dsn);
    };
  }
}
