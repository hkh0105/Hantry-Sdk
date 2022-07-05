import { Hantry } from "hantry-js-core";
import { getUserInfo, getErrorStack, debounce } from "hantry-js-utils";

export class HantryReact extends Hantry {
  constructor(dsn, options) {
    super(dsn, options);
    this.platform = "react";
    this.breadcrumbs = [];
  }

  captureClickEvent() {
    window.addEventListener(
      "click",
      debounce(event => {
        event.preventDefault();
        this.breadcrumbs.push(event.target);
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
        this.breadcrumbs.push(window.location.href);
      }, 100),
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
        lineno,
        colno,
        stack,
        user,
        breadcrumbs: this.breadcrumbs,
      };

      this.breadcrumbs = [];
      return await super.createError(newError, this.dsn);
    }, 100);
  }

  captureRejectionException() {
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

  observerStart() {
    const observer = new PerformanceObserver((list, obj) => {
      list.getEntries().forEach(async entry => {
        const parsedEntry = parseEntryType(entry);

        await sendPerformance(entry.entryType, parsedEntry, this.dsn);
      });
    });

    observer.observe({
      entryTypes: [
        "first-input",
        "largest-contentful-paint",
        "layout-shift",
        "longtask",
        "mark",
        "measure",
        "navigation",
        "paint",
      ],
    });
  }

  async sendPerformance(entryType, parsedEntry, dsn) {
    const API = "http://localhost:8000/users";

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
