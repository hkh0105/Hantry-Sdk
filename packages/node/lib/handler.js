const { getErrorStack } = require("hantry-js-utils");

const errorHandler = (error, req, res, next) => {
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

module.exports = { errorHandler };
