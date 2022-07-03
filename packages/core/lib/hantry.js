import { sendError } from "hantry-js-utils";

export class Hantry {
  constructor(dsn, options) {
    this.dsn = dsn;
    this.options = options;
  }

  captureError(error) {
    return console.log(error);
  }
  captureMessage(message) {
    return console.log(message);
  }
  async createError(error, dsn) {
    return await sendError(error, dsn);
  }
}
