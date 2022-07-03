import { init } from "../package/react/src/sdk";

init("1234", {});
const testUnhandledRejection = () => {
  this.loaded = Promise.reject(new Error("Resource not yet loaded!"));
};

const resource = testUnhandledRejection();
console.log(resource);
