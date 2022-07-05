import { Profiler } from "./hantryProfiler";

export const init = (dsn, options) => {
  const profiler = new Profiler(dsn, options);
  profiler.observerStart();
};
