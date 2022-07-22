import { debounce } from "hantry-js-utils";

export const clickEvnetCb = event => {
  event.preventDefault();
  this.breadcrumbsClick.push(event.target.outerHTML);
};

export const debouncedClickCb = debounce(clickEvnetCb, 1000);

export const urlChangeCb = event => {
  event.preventDefault();
  this.breadcrumbsURL.push(window.location.href);
};

export const debouncedUrlCb = debounce(urlChangeCb, 1000);
