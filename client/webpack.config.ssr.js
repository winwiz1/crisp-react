const path = require("path");
const webpack = require("webpack")
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
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
                modules: {
                  auto: (filename) => /\.module\.css$/i.test(filename),
                }
              }
            }
          ],
        },
        {
          test: /\.less$/i,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                emit: true,
              },
            },
            {
              loader: "css-loader",
              options: {
                modules: {
                  auto: false,
                }
              }
            },
            {
              loader: "less-loader",
            },
          ],
        },
        {
          test: /\.(png|jpg|gif|mp3|woff|woff2|eot|ttf|svg)$/i,
          type: "asset",
          parser: {
            dataUrlCondition: {
              maxSize: 10 * 1024
            }
          },
          generator: {
            filename: "img/[hash][ext]"
          }
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
      new webpack.DefinePlugin({
        "process.env.DEVELOPMENT": JSON.stringify(isProduction === false),
        "CF_PAGES": !!process.env.CF_PAGES,
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
      clean: true,
      compareBeforeEmit: false,
    },
    externals: [nodeExternals()],
  };
