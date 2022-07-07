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

  async sendError(error, dsn) {
    const API = "http://localhost:8000/users";

    try {
      const postErrorResoponse = await axios.post(
        `${API}/project/${dsn}/error`,
        { error: error },
      );
    } catch (err) {
      console.log(err);
    }
  }
}
