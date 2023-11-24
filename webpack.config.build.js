import { merge } from "webpack-merge";
import path from "path";
import config from "./webpack.config.js";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default merge(config, {
  mode: "production",

  output: {
    path: path.join(__dirname, "public"),
  },

  plugins: [new CleanWebpackPlugin()],
});
