const path = require("path");
const { node } = require("prop-types");
const webpack = require("webpack");

module.exports = {
  target: node,
  mode: "production",
  resolve: {
    modules: ["node_modules"],
    extensions: [".js"],
  },
  entry: "./lib/node.js",

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
        options: {
          configFile: path.resolve(__dirname, ".babelrc.js"),
        },
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "index.js",
    libraryTarget: "umd",
    umdNamedDefine: true,
  },
};
