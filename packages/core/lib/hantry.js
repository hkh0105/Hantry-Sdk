import axios from "axios";

export class Hantry {
  constructor(dsn, options) {
    this.dsn = dsn;
    this.options = options;
  }

  captureError(error) {
    const stack = error.stack;
    const user = error.user;
    const newError = {
      type: error.name,
      message: error.message,
      location: {
        lineno: error.lineNumber,
        colno: error.columnNumber,
      },
      stack,
      createdAt: Date.now(),
      user,
    };
    return console.log(error);
  }

  async sendError(error, dsn) {
    const API = "http://localhost:8000/users";

    try {
      const postErrorResoponse = await axios.post(
        `${API}/project/${dsn}/error`,
        error,
      );
      console.log(postErrorResoponse);
    } catch (err) {
      console.log(err);
    }
  }
}
