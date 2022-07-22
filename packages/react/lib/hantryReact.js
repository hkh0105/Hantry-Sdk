import { Hantry } from "hantry-js-core";
import {
  getUserInfo,
  getErrorStack,
  debounce,
  throttle,
} from "hantry-js-utils";
import axios from "axios";

export class HantryReact extends Hantry {
  constructor(dsn, options) {
    super(dsn, options);
    this.platform = "react";
    this.breadcrumbsClick = [];
    this.breadcrumbsURL = [];
  }

  cachingOfflineErrorToStorage(error) {
    if (window.localStorage.getItem("error")) {
      const savedItems = JSON.parse(window.localStorage.getItem("error"));

      savedItems.length > 30
        ? window.localStorage.setItem("error", savedItems)
        : window.localStorage.setItem("error", savedItems.push(error));
    }

    if (!window.localStorage.getItem("error")) {
      const errorList = [];
      errorList.push(error);
      window.localStorage.setItem("error", errorList);
    }
  }

  captureOfflineEvent(event) {
    if (window && window.navigator && !window.navigator.onLine) {
      cachingOfflineErrorToStorage(error);
    }

    if (window && window.navigator && window.navigator.onLine) {
      const savedItems = JSON.parse(window.localStorage.getItem("error"));
      window.localStorage.removeItem("error");
      savedItems.map(error => {
        this.sendError(error, this.dsn);
      });
    }
  }

  captureClickEvent() {
    window.addEventListener(
      "click",
      debounce(event => {
        event.preventDefault();
        this.breadcrumbsClick.push(event.target.outerHTML);
      }, 1000),
    );
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

    window.addEventListener(
      "locationchange",
      debounce(() => {
        this.breadcrumbsURL.push(window.location.href);
      }, 1000),
    );
  }

  captureUncaughtException() {
    window.onerror = debounce(
      async (message, source, lineno, colno, error) => {
        const stack = getErrorStack(error);
        const user = getUserInfo(window.navigator.userAgent);
        const newError = {
          type: error.name,
          message,
          source,
          location: {
            lineno: lineno,
            colno: colno,
          },
          stack,
          user,
          breadcrumbsClick: this.breadcrumbsClick,
          breadcrumbsURL: this.breadcrumbsURL,
          createdAt: Date.now(),
        };

        this.breadcrumbsClick = [];
        this.breadcrumbsURL = [];

        return await this.sendError(newError, this.dsn);
      },
      1000,
      { leading: true },
    );
  }

  captureRejectionException() {
    window.onunhandledrejection = debounce(
      async event => {
        const stack = getErrorStack(event);
        const user = getUserInfo(window.navigator.userAgent);
        const newError = {
          type: "Rejection Error",
          message: event.reason.message,
          source: "",
          location: {
            lineno: stack[0].lineno,
            colno: stack[0].colno,
          },
          stack: stack,
          user,
          breadcrumbsClick: this.breadcrumbsClick,
          breadcrumbsURL: this.breadcrumbsURL,
          createdAt: Date.now(),
        };

        this.breadcrumbsClick = [];
        this.breadcrumbsURL = [];

        return await this.sendError(newError, this.dsn);
      },
      1000,
      { leading: true },
    );
  }

  async sendPerformance(entryType, parsedEntry, dsn) {
    const API = "https://hantry.click/users";

    try {
      const postPerformanceResoponse = await axios.post(
        `${API}/project/${dsn}/performance`,
        {
          parsedEntry,
          entryType,
        },
      );
    } catch (err) {
      console.log(err);
    }
  }
}
