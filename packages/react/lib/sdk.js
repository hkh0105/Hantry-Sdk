import { HantryReact } from "./hantryReact";

export const init = (dsn, options) => {
  const hantryReact = new HantryReact(dsn, options);
  hantryReact.captureUncaughtException();

  if (options.breadcrumbsClick) {
    hantryReact.captureClickEvent();
  }

  if (options.breadcrumbsURL) {
    hantryReact.captureUriChange();
  }

  if (options.rejection) {
    hantryReact.captureRejectionException();
  }
};
