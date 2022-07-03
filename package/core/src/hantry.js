import { sendError } from "../../utils/src/sendError";

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
  async createError(error) {
    return await sendError(error, this.dsn);
  }
}
