const { Hantry } = require("hantry-js-core");
const { getErrorStack } = require("hantry-js-utils");

class HantryNode extends Hantry {
  constructor(dsn, options) {
    super(dsn, options);
    this.platform = "node";
  }

  captureUncaughtException() {
    process.on("uncaughtException", error => {
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

      return await this.sendError(newError, this.dsn);
    });
    return;
  }

  captureRejectionException() {
    process.on('unhandledRejection', (reason, promise) => {
      const stack = getErrorStack(reason.reason);
      const newError = {
        type: "Rejection Error",
        message: reason,
        source: "",
        location: {
          lineno: 1,
          colno: 1,
        },
        stack: stack,
        user,
        createdAt: Date.now(),
      };

      return await this.sendError(newError, this.dsn);
    });
  }
}

module.exports = { HantryNode }
