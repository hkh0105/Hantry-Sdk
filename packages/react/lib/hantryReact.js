import { Hantry } from "hantry-js-core";
import {
  getUserInfo,
  getErrorStack,
  debounce,
  throttle,
} from "hantry-js-utils";
import {
  debouncedClickCb,
  debouncedUrlCb,
  debouncedErrorCapture,
  debouncedRejectionErrorCapture,
} from "./utils";
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
    window.addEventListener("click", debouncedClickCb);
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

    window.addEventListener("locationchange", debouncedUrlCb);
  }

  captureUncaughtException() {
    window.onerror = debouncedErrorCapture;
  }

  captureRejectionException() {
    window.onunhandledrejection = debouncedRejectionErrorCapture;
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
