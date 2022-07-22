import { debounce } from "hantry-js-utils";
import { getUserInfo, getErrorStack } from "hantry-js-utils";
import _ from "lodash";

export const clickEvnetCb = event => {
  event.preventDefault();
  this.breadcrumbsClick.push(event.target.outerHTML);
};

export const debouncedClickCb = _.debounce(clickEvnetCb, 1000);

export const urlChangeCb = event => {
  event.preventDefault();
  this.breadcrumbsURL.push(window.location.href);
};

export const debouncedUrlCb = _.debounce(urlChangeCb, 1000);

export const debouncedErrorCapture = _.debounce(
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

export const debouncedRejectionErrorCapture = _.debounce(
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

    return this.sendError(newError, this.dsn);
  },
  1000,
  { leading: true },
);
