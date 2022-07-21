import { Profiler } from "./hantryProfiler";

export const Profilerinit = (dsn, options) => {
  const profiler = new Profiler(dsn, options);
  profiler.observerStart();
};
