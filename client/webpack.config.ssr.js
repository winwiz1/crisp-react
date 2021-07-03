const path = require("path");
const webpack = require("webpack")
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const isProduction = true;

// Supress "Failed to load tsconfig.json: Missing baseUrl in compilerOptions" error message.
// Details: https://github.com/dividab/tsconfig-paths-webpack-plugin/issues/17
delete process.env.TS_NODE_PROJECT;

module.exports = {
    mode: "production",
    target: "node",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "ts-loader",
              options: {
                transpileOnly: true,
                happyPackMode: true,
                configFile: path.resolve(__dirname, "tsconfig.ssr.json"),
              },
            }
          ],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                emit: false,
              },
            },
            {
              loader: "css-loader",
              options: {
                modules: true
              }
            }
          ],
        },
      ]
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      plugins: [
        new TsconfigPathsPlugin({ configFile: "./tsconfig.ssr.json", baseUrl: "."})
      ]
    },
    plugins: [
      new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ["dist-ssr"]}),
      new webpack.DefinePlugin({
        "process.env.DEVELOPMENT": JSON.stringify(isProduction === false)
      }),
      new ForkTsCheckerWebpackPlugin({
        typescript: true,
        eslint: undefined,
        logger: { infrastructure: "console", issues: "console" }
      }),
      new MiniCssExtractPlugin({
        linkType: "text/css",
        filename: "[name].[fullhash].css",
        chunkFilename: "[id].[fullhash].css",
      }),
    ],
    output: {
      path: path.resolve(__dirname, 'dist-ssr'),
      filename: "ssr-library.js",
      library: "ssrLibrary",
      libraryTarget: "commonjs",
    },
    externals: [nodeExternals()],
  };
