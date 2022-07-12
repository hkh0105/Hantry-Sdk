import * as http from "http";
import { getErrorStack } from "hantry-js-utils";

export const errorHandler = (error, req, res, next) => {
  return function errorMiddleware(error, req, res, next) {
    const stack = getErrorStack(error);
    const newError = {
      type: error.name,
      message: error.message,
      source: error.source,
      location: {
        lineno: error.lineNumber,
        colno: error.columnNumver,
      },
      stack,
      createdAt: Date.now(),
    };

    next(newError);
  };
};
