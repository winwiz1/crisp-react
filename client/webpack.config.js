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
const metaDescription = "Skeleton website built using Crisp React \
https://github.com/winwiz1/crisp-react boilerplate. Consists of two sample \
React SPAs with optional build-time SSR turned on for the second SPA.";
const metaKeywords = "React, TypeScript, Express, webpack, NodeJS, Jest";
const metaOwnUrl = "https://crisp-react.winwiz1.com/";


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
      filename: "[name].[fullhash].bundle.js",
      chunkFilename: "[name].[fullhash].bundle.js",
      path: path.resolve(__dirname, "dist"),
      publicPath: "/static/",
      crossOriginLoading: "anonymous",
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
            parallel: true,
            terserOptions: {
              keep_classnames: false,
              mangle: true,
              compress: false,
              keep_fnames: false,
              output: {
                comments: false,
              }
            },
            extractComments: false
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
        typescript: true,
        eslint: undefined,
        logger: { infrastructure: "console", issues: "console" }
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
        inject: true,
        title: configuredSPAs.appTitle,
        appMountId: "app-root",
        alwaysWriteToDisk: true,
        filename: `${entryPoint}.html`,
        chunks: [`${entryPoint}`, "vendor", "runtime"],
        headHtmlSnippet,
        links: [
          {
            rel: "dns-prefetch",
            href: "//fonts.gstatic.com/"
          },
          {
            rel: "dns-prefetch",
            href: "//fonts.googleapis.com/"
          },
          {
            rel: "stylesheet",
            href: "//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css",
            integrity: "sha384-JKIDqM48bt14NZpzl9v0AP36VK2C/X6RuSPfimxpoWdSANUXblZUX1cgdQw8cZUK",
            crossorigin: "anonymous"
          },
          {
            href: metaOwnUrl,
            rel: "canonical"
          },
          {
            href: "/apple-touch-icon.png",
            rel: "apple-touch-icon",
            sizes: "180x180"
          },
        ],
        meta: {
          viewport:    "width=device-width, initial-scale=1.0, shrink-to-fit=no",
          description: metaDescription,
          keywords:    metaKeywords,
          robots:      "index, follow",
        },
        minify: false,
      })
    );
  })

  config.plugins.push(new HtmlWebpackHarddiskPlugin());

  if (isProduction) {
    const CompressionPlugin = require("compression-webpack-plugin");
    const SriPlugin = require("webpack-subresource-integrity");

    config.plugins.push(
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify("production")
      }));
    config.plugins.push(
      new SriPlugin({
      hashFuncNames: ["sha384"]
    }));
    config.plugins.push(
      new CompressionPlugin({
        filename: "[path][base].br",
        algorithm: "brotliCompress",
        test: /\.js$|\.css$|\.html$/,
        compressionOptions: {
          level: 11,
        },
        threshold: 10240,
        minRatio: 0.8,
        deleteOriginalAssets: false,
      }));
    config.plugins.push(
      new CompressionPlugin({
        filename: "[path][base].gz",
        algorithm: "gzip",
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.8
      }));
  }

  return config;
}

module.exports = getWebpackConfig;
