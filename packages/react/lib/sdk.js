import { HantryReact } from "./hantryProfiler";

export const init = (dsn, options) => {
  const hantryReact = new HantryReact(dsn, options);
  hantryReact.captureUncaughtException();
  hantryReact.captureRejectionException();

  if (options.breadcrumbsClick) {
    hantryReact.captureClickEvent();
  }

  if (options.breadcrumbsURL) {
    hantryReact.captureUriChange();
  }

  if (options.profiler) {
    hantryReact.observerStart();
  }
};
