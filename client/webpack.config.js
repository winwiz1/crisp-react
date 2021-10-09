const path = require("path");
const fs = require("fs");
const webpack = require("webpack")
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackHarddiskPlugin = require("html-webpack-harddisk-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const configuredSPAs = require("./config/spa.config");
const verifier = require("./config/verifySpaParameters");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const headHtmlSnippetPath = path.join("src", "entrypoints", "head-snippet.html");
const headHtmlSnippet = fs.existsSync(headHtmlSnippetPath) ?
  fs.readFileSync(headHtmlSnippetPath, "utf8") : undefined;
const metaDescription = "React boilerplate written in TypeScript with a variety \
of Jamstack and full stack deployments";

configuredSPAs.verifyParameters(verifier);

// Supress "Failed to load tsconfig.json: Missing baseUrl in compilerOptions" error message.
// Details: https://github.com/dividab/tsconfig-paths-webpack-plugin/issues/17
delete process.env.TS_NODE_PROJECT;

const getWebpackConfig = (env, argv) => {
  const isProduction = (env && env.prod) ? true : false;
  const isJamstack = (env && env.jamstack) ? true : false;

  const config = {
    mode: isProduction ? "production" : "development",
    target: ["web", "es5"],
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
          use: [
            isProduction?
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                emit: true,
              },
            } :
            {
              loader: "style-loader",
              options: {
                injectType: "singletonStyleTag",
              },
            },
            {
              loader: "css-loader",
              options: {
                // Regex match ensures the .css file is treated as CSS Module 
                // and class selector names are mangled to be unique. The
                // key-value pairs (with non-mangled e.g. taken from the .css
                // file selector names used as the keys and mangled ones being
                // the values) are injected into the default export object. We
                // import it as 'styles' object.
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
            isProduction?
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                emit: true,
              },
            } :
            {
              loader: "style-loader",
              options: {
                injectType: "singletonStyleTag",
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
        new TsconfigPathsPlugin()
      ]
    },
    output: {
      filename: "[name].[fullhash].bundle.js",
      chunkFilename: "[name].[fullhash].bundle.js",
      path: path.resolve(__dirname, "dist"),
      publicPath: isJamstack? "/" : "/static/",
      crossOriginLoading: "anonymous",
      clean: true,
      compareBeforeEmit: false,
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /node_modules/,
            chunks: "initial",
            name: "vendor",
            enforce: true,
            maxInitialSize: isProduction ? 1000000 : undefined
          },
          styles: {
            name: "styles",
            type: "css/mini-extract",
            chunks: "all",
            enforce: true,
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
          }),
          new CssMinimizerPlugin({
            parallel: true,
          }),
        ]
      }),
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
      })
    ],
    devServer: {
      allowedHosts: "localhost",
      bonjour: false,
      client: {
        logging: "info",
        overlay: { errors: true, warnings: false },
        progress: true,
      },
      devMiddleware: {
        index: `/${configuredSPAs.getRedirectName()}.html`,
        publicPath: isJamstack? "/" : "/static/",
        serverSideRender: false,
        writeToDisk: true,
      },
      static: {
        directory: path.join(__dirname, "dist"),
      },
      hot: true,
      liveReload: true,
      port: 8080,
      historyApiFallback: {
        index: `${configuredSPAs.getRedirectName()}.html`,
        rewrites: configuredSPAs.getRewriteRules()
      },
      watchFiles: ["src/**", `${path.join(__dirname, "dist")}`],
    },
    context: path.resolve(__dirname),
  };

  configuredSPAs.getNames().forEach((entryPoint) => {
    config.plugins.push(
      new HtmlWebpackPlugin({
        template: require("html-webpack-template"),
        inject: "body",
        scriptLoading: "blocking",
        title: configuredSPAs.appTitle,
        appMountId: "app-root",
        alwaysWriteToDisk: true,
        filename: `${entryPoint}.html`,
        chunks: [`${entryPoint}`, "vendor", "runtime"],
        headHtmlSnippet,
        links: [
          {
            rel: "preload",         // imported by the SUI stylesheet below
            href: "https://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic&subset=latin",
            as: "style",
          },
          {
            rel: "stylesheet",
            href: "https://cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css",
            integrity: "sha384-JKIDqM48bt14NZpzl9v0AP36VK2C/X6RuSPfimxpoWdSANUXblZUX1cgdQw8cZUK",
            crossorigin: "anonymous"
          },
          {
            rel: "preconnect",
            href: "https://fonts.gstatic.com/",
            crossorigin: "anonymous"
          },
          {
            href: "/apple-touch-icon.png",
            rel: "apple-touch-icon",
            sizes: "180x180"
          },
        ],
        meta: {
          viewport:    "width=device-width, initial-scale=1.0",
          description: metaDescription,
        },
        minify: false,
      })
    );
  })

  config.plugins.push(new HtmlWebpackHarddiskPlugin());

  if (isProduction) {
    const CompressionPlugin = require("compression-webpack-plugin");
    const SriPlugin = require("webpack-subresource-integrity");
    const compressionRegex = /\.(js|css|html|ttf|svg|woff|woff2|eot)$/;

    config.plugins.push(
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify("production")
      })
    );
    config.plugins.push(
      new CompressionPlugin({
        filename: "[path][base].br",
        algorithm: "brotliCompress",
        test: compressionRegex,
        compressionOptions: {
          level: 11,
        },
        threshold: 10240,
        minRatio: 0.8,
        deleteOriginalAssets: false,
      })
    );
    config.plugins.push(
      new CompressionPlugin({
        filename: "[path][base].gz",
        algorithm: "gzip",
        test: compressionRegex,
        threshold: 10240,
        minRatio: 0.8
      })
    );
    config.plugins.push(
      new MiniCssExtractPlugin({
        linkType: "text/css",
        filename: "[name].[fullhash].css",
      })
    );
    config.plugins.push(
      new SriPlugin.SubresourceIntegrityPlugin()
    );
  }

  return config;
}

module.exports = getWebpackConfig;
