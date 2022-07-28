import { Hantry } from "hantry-js-core";
import { getUserInfo, getErrorStack, debounce } from "hantry-js-utils";

export class HantryReact extends Hantry {
  constructor(dsn, options) {
    super(dsn, options);
    this.platform = "react";
    this.breadcrumbsClick = [];
    this.breadcrumbsURL = [];
  }

  // cachingOfflineErrorToStorage(error) {
  //   if (window.localStorage.getItem("error")) {
  //     const savedItems = JSON.parse(window.localStorage.getItem("error"));

  //     savedItems.length > 30
  //       ? window.localStorage.setItem("error", savedItems)
  //       : window.localStorage.setItem("error", savedItems.push(error));
  //   }

  //   if (!window.localStorage.getItem("error")) {
  //     const errorList = [];
  //     errorList.push(error);
  //     window.localStorage.setItem("error", errorList);
  //   }
  // }

  // captureOfflineEvent(event) {
  //   if (window && window.navigator && !window.navigator.onLine) {
  //     cachingOfflineErrorToStorage(error);
  //   }

  //   if (window && window.navigator && window.navigator.onLine) {
  //     const savedItems = JSON.parse(window.localStorage.getItem("error"));
  //     window.localStorage.removeItem("error");
  //     savedItems.map(error => {
  //       this.sendError(error, this.dsn);
  //       ss;
  //     });
  //   }
  // }

  captureClickEvent() {
    window.addEventListener(
      "click",
      debounce(event => {
        event.preventDefault();
        this.breadcrumbsClick.push(event.target.outerHTML);
      }, 100),
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
    window.onerror = debounce(async (message, source, lineno, colno, error) => {
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
    }, 1000);
  }

  captureRejectionException() {
    window.onunhandledrejection = async event => {
      console.log(event.reason);
      const stack = event.reason.stack.split("at");
      const user = getUserInfo(window.navigator.userAgent);
      const newError = {
        type: "Rejection Error",
        message: event.reason.message,
        source: "",
        location: {
          lineno: 0,
          colno: 0,
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
    };
  }

  observerStart() {
    const observer = new PerformanceObserver((list, obj) => {
      list.getEntries().forEach(async entry => {
        const parsedEntry = parseEntryType(entry);

        await sendPerformance(entry.entryType, parsedEntry, this.dsn);
      });
    });

    observer.observe({
      entryTypes: ["first-input"],
    });
  }

  async sendPerformance(entryType, parsedEntry, dsn) {
    const API = "https://hantry.click/users";
    const url = `${API}/project/${dsn}/performance`;
    const option = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parsedEntry: parsedEntry,
        entryType: entryType,
      }),
    };

    try {
      const postPerformanceResoponse = await fetch.post(url, option);
    } catch (err) {
      console.log(err);
    }
  }
}
