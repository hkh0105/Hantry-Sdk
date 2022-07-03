import { UAParser } from "ua-parser-js";

export function getUserInfo(user) {
  const userParser = new UAParser();
  const newUser = userParser.setUA(user);
  const userAgent = {
    os: newUser.getOS().name,
    browser: newUser.getBrowser().name,
    engine: newUser.getEngine().name,
    device: newUser.getDevice().name,
    cpu: newUser.getCPU(),
    url: newUser.getUA(),
  };
  console.log("newUser:", newUser);
  console.log("User:", userAgent);
  return userAgent;
}
