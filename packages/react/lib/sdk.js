import { HantryReact } from "./hantryReact";

export const init = (dsn, options) => {
  const hantryReact = new HantryReact(dsn, options);
  console.log(dsn, options);
  hantryReact.captureUncaughtException();
  hantryReact.onUnhandledRejection();
};
