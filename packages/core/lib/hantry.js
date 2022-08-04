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
    const API = "https://hantry.click/users";
    const url = `${API}/project/${dsn}/error`;
    const option = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: error,
      }),
    };

    try {
      const postErrorResoponse = await fetch(url, option);
    } catch (err) {
      console.log(err);
    }
  }
}
