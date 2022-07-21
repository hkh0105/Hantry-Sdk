const { init } = require("hantry-js-node");

init("0879e46c-1e62-4245-ab65-20dcbb3ce12f", {});

const testError = () => {
  throw new Error("testing Error");
};

testError();

const testUnhandledRejection = () => {
  this.loaded = Promise.reject(new Error("Resource not yet loaded!"));
};

const resource = testUnhandledRejection();
