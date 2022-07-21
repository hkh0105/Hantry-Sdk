const { Hantry } = require("hantry-js-core");

class HantryNode extends Hantry {
  constructor(dsn, options) {
    super(dsn, options);
    this.platform = "node";
  }

  captureUncaughtException() {
    process.on("uncaughtException", error => {
      const stack = error.stack.toString().split("\n");
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

      return this.sendError(newError, this.dsn);
    });
    // return;
  }

  captureRejectionException() {
    process.on("unhandledRejection", (reason, promise) => {
      const stack = error.stack.toString().split("\n");
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

      return this.sendError(newError, this.dsn);
    });
  }
}

module.exports = { HantryNode };
