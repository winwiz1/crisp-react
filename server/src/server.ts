/**
 * The class Server is responsible for Express configuration.
 * Express is configured to serve the build artefacts produced
 * by the sibling 'client' project (script bundles, HTML files,
 * source maps) either from disk or from webpack-dev-server
 * acting as a reverse proxy for the latter.
 */
import * as path from "path";
import * as express from "express";
import nodeFetch from "node-fetch";
import { CustomError, handleErrors } from "./utils/error";
import { logger } from "./utils/logger";
import proxy = require('http-proxy-middleware');

export enum StaticAssetPath {
  // The path to static assets served by Express needs to be
  // resolved starting from the source .ts files located
  // under src/
  SOURCE = 0,
  // The path to static assets served by Express needs to be
  // resolved starting from the transpiled .js files located
  // under src/../build/js/
  TRANSPILED = 1,
}

class Server {
  constructor() {
    this.m_app = express();
    this.addRoutes();
    handleErrors(this.m_app);
  }

  public readonly getApp = (assetPath: StaticAssetPath = StaticAssetPath.TRANSPILED) => {
     this.m_assetPath = assetPath;
     return this.m_app;
  }

  private addRoutes(): void {
    this.m_app.get("/", (_req, res, next) => {
      if (Server.s_useDevWebserver) {
        // Get the resourse from dev server
        this.sendDevServerFile("/first.html", res, next);
      } else {
        // Serve the static asset from disk
        res.sendFile(path.resolve(this.getAssetPath(), "first.html"));
      }
    });

    this.m_app.get("/:entryPoint([\\w.]+)", (req, res, next) => {
      let entryPoint: string|undefined = req.params.entryPoint;
      const match = Server.s_regexEntrypoint.test(entryPoint || "");

      if (match) {
        entryPoint!.endsWith(Server.s_htmlExtension) || (entryPoint! += Server.s_htmlExtension);
        if (Server.s_useDevWebserver) {
          // Get the requested resourse from dev server
          this.sendDevServerFile(`/${entryPoint}`, res, next);
        } else {
          // Serve the static asset from disk
          res.sendFile(path.resolve(this.getAssetPath(), entryPoint!));
        }
      } else {
        // Emulate historyApiFallback in webpack-dev-server
        res.redirect(303, "/");
      }
    });

    this.m_app.get("/static/:bundleFile", (req, res, next) => {
      const bundleFile: string|undefined = (req.params as any).bundleFile;
      const match = Server.s_regexBundle.test(bundleFile || "");

      if (match) {
        if (Server.s_useDevWebserver) {
          this.sendDevServerFile(`/static/${bundleFile}`, res, next);
        } else {
          res.sendFile(path.resolve(this.getAssetPath(), bundleFile!));
        }
      } else {
        // Do not be as forgiving as with historyApiFallback emulation above
        const err = new CustomError(404, "Resourse not found");
        logger.info(`Invalid static resourse "${bundleFile}" requested from ${req.ips} using path ${req.originalUrl}`);
        return next(err);
      }
    });

    if (Server.s_useDevWebserver) {
      this.m_app.use(
        '/sockjs-node',
        proxy({ target: Server.s_urlDevWebserver, changeOrigin: true, ws: true })
      );
    }

    // Default 404 handler
    this.m_app.use((req, _res, next) => {
      const err = new CustomError(404, "Resourse not found");
      logger.info(`Invalid resourse requested from ${req.ips} using path ${req.originalUrl}`);
      return next(err);
    });
  }

  private sendDevServerFile(page: string, res: express.Response, next: express.NextFunction) {
    const devUrl = Server.s_urlDevWebserver + page;

    nodeFetch(devUrl)
      .then(resp => {
        const contentType = resp.headers.get("content-type") || "application/json";
        res.setHeader("Content-Type", contentType);
        if (page.startsWith("/static/")) {
          res.setHeader("Cache-Control", "max-age=31536000");
        }
        resp.body.pipe(res);
      })
      .catch(err => {
        const errMsg = "Failed to send static resourse from internal server";
        const logMsg = `Failed to send ${devUrl} from dev-webserver due to error: ${err}`;
        logger.error(logMsg);
        next(new CustomError(500, errMsg));
      });
  }

  private getAssetPath(): string {
    return path.join(__dirname,
      this.m_assetPath === StaticAssetPath.TRANSPILED ?
      "../client/" : "../build/client");
  }

  private readonly m_app: express.Application;
  private m_assetPath: StaticAssetPath = StaticAssetPath.TRANSPILED;
  private static readonly s_htmlExtension = ".html";
  private static readonly s_urlDevWebserver = "http://localhost:8080";
  /* tslint:disable:no-string-literal */
  private static readonly s_useDevWebserver = process.env["USE_DEV_WEBSERVER"] === "true";
  /* tslint:enable:no-string-literal */
  private static readonly s_regexEntrypoint = /^((first)|(second))(\.html)?$/;
  private static readonly s_regexBundle =
    /^((first)|(second)|(runtime)|(vendor))\.\w{16,32}\.bundle\.js(\.map)?$/;
  }

export default new Server().getApp;
