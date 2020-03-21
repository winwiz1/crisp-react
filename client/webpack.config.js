const path = require("path");
const fs = require("fs");
const webpack = require("webpack")
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackHarddiskPlugin = require("html-webpack-harddisk-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const configuredSPAs = require("./config/spa.config");
const verifier = require("./config/verifySpaParameters");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const headHtmlSnippetPath = path.join("src", "entrypoints", "head-snippet.html");
const headHtmlSnippet = fs.existsSync(headHtmlSnippetPath) ?
  fs.readFileSync(headHtmlSnippetPath, "utf8") : undefined;

configuredSPAs.verifyParameters(verifier);

// Supress "Failed to load tsconfig.json: Missing baseUrl in compilerOptions" error message.
// Details: https://github.com/dividab/tsconfig-paths-webpack-plugin/issues/17
delete process.env.TS_NODE_PROJECT;

const getWebpackConfig = (env, argv) => {
  const isProduction = (env && env.prod) ? true : false;

  const config = {
    mode: isProduction ? "production" : "development",
    devtool: "source-map",
    entry: configuredSPAs.getEntrypoints(),
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
                configFile: path.resolve(__dirname, "tsconfig.json"),
              },
            }
          ],
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ]
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      plugins: [
        new TsconfigPathsPlugin()
      ]
    },
    output: {
      filename: "[name].[hash].bundle.js",
      chunkFilename: "[name].[hash].bundle.js",
      path: path.resolve(__dirname, "dist"),
      publicPath: "/static/",
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /node_modules/,
            chunks: "initial",
            name: "vendor",
            enforce: true
          },
        },
      },
      runtimeChunk: "single",
      ...(isProduction && {
        minimizer: [
          new TerserPlugin({
            cache: false,
            parallel: true,
            sourceMap: false,         // set to true if debugging of production build needed
            terserOptions: {
              keep_classnames: false,
              mangle: true,
              compress: false,
              keep_fnames: false,
              output: {
                comments: false,
              }
            }
          })
        ]
      }),
    },
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.DefinePlugin({
        "process.env.DEVELOPMENT": JSON.stringify(isProduction === false)
      }),
      new ForkTsCheckerWebpackPlugin({
        tslint: false,
        useTypescriptIncrementalApi: true,
        checkSyntacticErrors: true,
      })
    ],
    devServer: {
      index: `/${configuredSPAs.getRedirectName()}.html`,
      publicPath: "/static/",
      contentBase: path.join(__dirname, "dist"),
      compress: false,
      hot: true,
      inline: true,
      port: 8080,
      writeToDisk: true,
      historyApiFallback: {
        index: `${configuredSPAs.getRedirectName()}.html`,
        rewrites: configuredSPAs.getRewriteRules()
      }
    },
    context: path.resolve(__dirname),
  };

  configuredSPAs.getNames().forEach((entryPoint) => {
    config.plugins.push(
      new HtmlWebpackPlugin({
        template: require("html-webpack-template"),
        inject: false,
        title: configuredSPAs.appTitle,
        appMountId: "react-root",
        alwaysWriteToDisk: true,
        filename: `${entryPoint}.html`,
        chunks: [`${entryPoint}`, "vendor", "runtime"],
        addBrotliExtension: isProduction,
        headHtmlSnippet,
        links: [
          "//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
        ],
        meta: [
          { name: "viewport", content: "width=device-width, initial-scale=1.0, shrink-to-fit=no" },
        ],
      })
    );
  })

  config.plugins.push(new HtmlWebpackHarddiskPlugin());

  if (isProduction) {
    const BrotliPlugin = require("brotli-webpack-plugin");
    const CompressionPlugin = require("compression-webpack-plugin")
    const HtmlWebpackBrotliPlugin = require("html-webpack-brotli-plugin")

    config.plugins.push(
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify("production")
      }));
    config.plugins.push(
      new BrotliPlugin({
        asset: "[path].br[query]",
        test: /\.(js|css|html|svg)$/,
        threshold: 10240,
        minRatio: 0.8
      }));
    config.plugins.push(
      new HtmlWebpackBrotliPlugin()
    );
    config.plugins.push(
      new CompressionPlugin({
        filename: "[path].gz[query]",
        algorithm: "gzip",
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.8
      }));
  }

  return config;
}

module.exports = getWebpackConfig;
