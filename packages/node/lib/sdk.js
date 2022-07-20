const { HantryNode } = require("./hantryNode");

const init = (dsn, options) => {
  const hantryNode = new HantryNode(dsn, options);
  hantryNode.captureUncaughtException();
  hantryNode.captureRejectionException();
};

module.exports = { init };
