const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "production",
  resolve: {
    modules: ["node_modules"],
    extensions: [".js"],
  },
  entry: "./lib/react.js",

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
    library: {
      name: "hantry-js-react",
      type: "umd",
    },
  },
};
