import { merge } from "webpack-merge";
import path from "path";
import config from "./webpack.config.js";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default merge(config, {
  mode: "development",

  devtool: "inline-source-map",

  devServer: {
    devMiddleware: {
      writeToDisk: true,
    },
  },

  output: {
    path: path.resolve(__dirname, "public"),
  },
});
