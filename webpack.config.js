import path from "path";
import webpack from "webpack";
import CopyWebpackPlugin from "copy-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import terserWebpackPlugin from "terser-webpack-plugin";
import ImageMinimizerPlugin from "image-minimizer-webpack-plugin";
import { fileURLToPath } from "url";
import BrowserSyncPlugin from "browser-sync-webpack-plugin";

const IS_DEVELOPMENT = process.env.NODE_ENV === "dev";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dirApp = path.join(__dirname, "app");
const dirAssets = path.join(__dirname, "assets");
const dirStyles = path.join(__dirname, "styles");
const dirNode = "node_modules";

export default {
  entry: [path.join(dirApp, "index.js"), path.join(dirStyles, "index.scss")],

  resolve: {
    modules: [dirApp, dirAssets, dirNode],
  },
  plugins: [
    new webpack.DefinePlugin({
      IS_DEVELOPMENT,
    }),

    // new HtmlWebpackPlugin(),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./offline.html",
          to: "",
        },
        {
          from: "./shared",
          to: "",
        },
      ],
    }),

    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new ImageMinimizerPlugin({
      minimizer: {
        implementation: ImageMinimizerPlugin.imageminMinify,
        options: {
          // Lossless optimization with custom option
          // Feel free to experiment with options for better result for you
          plugins: [
            ["gifsicle", { interlaced: true }],
            ["jpegtran", { progressive: true }],
            ["optipng", { optimizationLevel: 5 }],
          ],
        },
      },
    }),

    new terserWebpackPlugin(),
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "",
            },
          },
          {
            loader: "css-loader",
          },
          {
            loader: "postcss-loader",
          },
          {
            loader: "sass-loader",
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg|webp|woff2|fnt)$/,
        loader: "file-loader",
        options: {
          name(file) {
            return "[hash].[ext]";
          },
        },
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: ImageMinimizerPlugin.loader,
          },
        ],
      },

      {
        test: /\.(glsl|frag|vert)$/i,
        loader: "raw-loader",
        exclude: /node_modules/,
      },

      {
        test: /\.(glsl|frag|vert)$/i,
        loader: "glslify-loader",
        exclude: /node_modules/,
      },
    ],
  },

  optimization: {
    minimize: true,
    minimizer: [new terserWebpackPlugin()],
  },
};
