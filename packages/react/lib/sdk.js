import { HantryReact } from "./hantryReact";

export const init = (dsn, options) => {
  const hantryReact = new HantryReact(dsn, options);
  hantryReact.captureUncaughtException();
  hantryReact.onUnhandledRejection();

  if (options.breadcrumbsClick) {
    hantryReact.captureClickEvent();
  }

  if (options.breadcrumbsURL) {
    hantryReact.captureUriChange();
  }
};
