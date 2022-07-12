import { HantryNode } from "./hantryNode";

export const init = (dsn, options) => {
  const hantryNode = new HantryNode(dsn, options);
  hantryNode.captureUncaughtException();
  hantryNode.captureRejectionException();
};
