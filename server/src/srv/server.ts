/*
 * The class Server is responsible for Express configuration.
 * Express is configured to serve the build artefacts produced
 * by the sibling 'client' sub-project (script bundles, HTML files,
 * source maps) either from disk or from webpack-dev-server
 * acting as a reverse proxy for the latter.
 */
import * as path from "path";
import * as express from "express";
import nodeFetch from "../utils/node-fetch";
const helmet = require("helmet");
import * as nocache from "nocache";
import * as expressStaticGzip from "express-static-gzip";
import { ServerResponse } from "http";
import favicon = require("serve-favicon");
import * as SPAs from "../../config/spa.config";
import { CustomError, handleErrors } from "../utils/error";
import { logger } from "../utils/logger";
import {
  useProxy,
  isProduction
} from "../utils/misc"
import { SampleController } from "../api/controllers/SampleController";
const { createProxyMiddleware } = require("http-proxy-middleware");

export enum StaticAssetPath {
  // The path to static assets served by Express needs to be
  // resolved starting from the source .ts files located
  // under src/srv
  SOURCE = 0,
  // The path to static assets served by Express needs to be
  // resolved starting from the transpiled .js files located
  // under build/
  TRANSPILED = 1,
}

class Server {
  constructor() {
    this.m_app = express();
    this.config();
    this.addRoutes();
    handleErrors(this.m_app);
  }

  public readonly getApp = (assetPath = StaticAssetPath.TRANSPILED) => {
    this.m_assetPath = assetPath;
    this.m_expressStaticMiddleware =
      expressStaticGzip(this.getAssetPath() + "/../", Server.s_expressStaticConfig);
    return this.m_app;
  }

  /********************** private methods and data ************************/

  private config(): void {
    this.m_app.use((req, res, next) => {
      const path = req.originalUrl;
      if (path.length > 1 && path.length <= 64 && path[0] === "/") {
        res.locals.matchRootLevel = Server.s_regexRootLevel.test(path);
        res.locals.matchLandingPages = Server.s_regexLandingPages.test(path);
      }
      next();
    });

    this.m_app.use([
      helmet(isProduction()? {
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            // CSP can be tested by removing the 'nomodule' attribute from inline <script>
            // located in head-snippet.html and observing browser's console message about
            // refusing to execute the script which in turn can be suppressed by
            // uncommenting the line below.
            // scriptSrc: ["'self'", "'sha256-SuONhcfr49gviXGu4vUSnIzwTSVHVAa7+O2walEP68E='"],
            styleSrc: ["'unsafe-inline'", "'self'", "cdn.jsdelivr.net", "fonts.googleapis.com"],
            fontSrc: ["data:", "fonts.googleapis.com", "cdn.jsdelivr.net", "fonts.gstatic.com"],
            imgSrc: ["'self'", "data:"],
            objectSrc: ["'none'"],
          }
        }
      } : {}),
      favicon(path.join(__dirname, "../../pub/", "fav.ico")),
      nocache()
    ]);

    this.m_app.disable("etag");
    this.m_app.set("trust proxy", useProxy());
  }

  private addRoutes(): void {
    // Redirect to the landing page of the SPA that has 'redirect: true'
    this.m_app.get("/", (_req, res, next) => {
      if (Server.s_useDevWebserver) {
        // Get the resource from dev server
        this.sendDevServerAsset(`/${SPAs.getRedirectName()}${Server.s_htmlExtension}`, res, next);
      } else {
        // Serve the static asset from disk
        this.sendProductionAsset(SPAs.getRedirectName() + Server.s_htmlExtension, res);
      }
    });

    this.m_app.get("/:entryPoint([\\w\\.-]{1,64})", (req, res, next) => {
      // eslint-disable-next-line prefer-const
      let entryPoint: string|undefined = req.params.entryPoint;
      const match = Server.isLandingPagesMatch(res);

      if (match) {
        // Serve SPA landing page
        entryPoint!.endsWith(Server.s_htmlExtension) || (entryPoint! += Server.s_htmlExtension);
        if (Server.s_useDevWebserver) {
          // Get the requested resource from dev server
          this.sendDevServerAsset(`/${entryPoint}`, res, next);
        } else {
          // Serve the static asset from disk
          this.sendProductionAsset(entryPoint!, res);
        }
      } else {
        if (entryPoint === Server.s_robotsName) {
          Server.setCacheHeaders(res);
          res.type("text/plain");
          res.send("User-agent: *\nAllow: /");
        } else {
          const match = Server.isRootLevelMatch(res);
          if (match) {
            this.sendProductionAsset(SPAs.getRedirectName() + Server.s_htmlExtension, res);
          } else {
            return next();
          }
        }
      }
    });

    this.m_app.get("/:entryPointPng([\\w-]+.png$)", (req, res, _next) => {
      const entryPoint: string|undefined = req.params.entryPointPng;
      if (entryPoint === Server.s_appleIcon) {
        Server.setCacheHeaders(res);
        res.sendFile(path.join(__dirname, "../../pub/", Server.s_appleIcon), { etag: true });
      }
    });

    // Serve client's build artifacts e.g. script bundles, source maps, .html files
    this.m_app.get("/static/:artifactFile", this.artifactsMiddleware);

    // Proxy to devserver ws:// protocol
    if (Server.s_useDevWebserver) {
      this.m_app.use("/sockjs-node",
        createProxyMiddleware({ target: Server.s_urlDevWebserver, changeOrigin: true, ws: true })
      );
    }

    SampleController.addRoute(this.m_app);

    // Default 404 handler
    this.m_app.use((_req, _res, next) => {
      const err = new CustomError(404, "Resource not found");
      err.unobscuredMessage = "Invalid resource requested";
      return next(err);
    });
  }

  private sendProductionAsset(page: string, res: express.Response) {
    res.sendFile(path.resolve(this.getAssetPath(), page), { etag: false });
  }

  private sendDevServerAsset(page: string, res: express.Response, next: express.NextFunction) {
    const devUrl = Server.s_urlDevWebserver + page;

    nodeFetch(devUrl)
      .then(resp => {
        if (!resp.ok) {
          throw new Error(`Failed to get ${devUrl} from dev server`);
        }
        const respStream = resp.body as NodeJS.ReadableStream;
        const contentType = resp.headers.get("content-type") || "application/json";

        res.setHeader("Content-Type", contentType);

        if (page.startsWith("/static/")) {
          res.setHeader("Cache-Control", "max-age=31536000");
        }

        respStream.pipe(res);
      })
      .catch(err => {
        const msg = `Failed to send ${devUrl} from dev-webserver due to error: ${err}`;
        logger.warn({ message: msg });
        next(new CustomError(500, msg, false, false));
      });
  }

  private getAssetPath(): string {
    return path.join(__dirname,
      this.m_assetPath === StaticAssetPath.TRANSPILED ?
        "../client/static/" : "../../build/client/static/");
  }

  // middleware responsible for serving client's build artifacts
  private artifactsMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const artifactFile: string|undefined = (req.params as any).artifactFile;
    const match = Server.s_regexArtifacts.test(artifactFile || "");

    if (match) {
      if (Server.s_useDevWebserver) {
        this.sendDevServerAsset(`/static/${artifactFile}`, res, next);
      } else {
        this.m_expressStaticMiddleware!(req, res, next);
      }
    } else {
      const err = new CustomError(404, "Resource not found");
      logger.info({ message: `Invalid static resource ${artifactFile} requested` });
      return next(err);
    }
  }

  // If there are two SPAs in spa.config.js called 'first and 'second',
  // then returns string: "(first)|(second)"
  private static getLandingPages(): string {
    const entryPoints = SPAs.getNames();
    let ret: string = "";
    entryPoints.forEach(spaName => {
      !!ret && (ret += "|");
      ret += `(${spaName})`;
    });
    return ret;
  }

  // Returns regex to match the landing pages.
  // If there are two SPAs in spa.config.js called 'first and 'second',
  // then returns RegExp similar to:  /^((first)|(second))(\.html)?$/;
  private static getLandingPagesRegex(): RegExp {
    return new RegExp(`^/?(${Server.getLandingPages()})(\\.html)?$`);
  }

  // Returns regex to match simple requests.
  private static getRootLevelRequestRegex(): RegExp {
    return new RegExp("^/?[\\w-]{1,64}$");
  }

  // Returns regex to match the requests for the client's build artifacts.
  // If there are two SPAs in spa.config.js called 'first and 'second',
  // then returns RegExp similar to:
  //   /^((first)|(second)|(runtime)|(vendor))\.\w{16,32}\.bundle\.js((\.map)|(\.gz)|(\.br))?$/
  private static getClientBuildArtifactsRegex(): RegExp {
    return new RegExp(`^(${Server.getLandingPages()}|(runtime)|(vendor)|(styles)|(csv)|(shr)|(ovw)|(abt)|(que)|(\\d{3}))(-\\w{8})?\\.\\w{16,32}((\\.bundle\\.js)|(.css))((\\.map)|(\\.gz)|(\\.br))?$`);
  }

  private static isRootLevelMatch(res: ServerResponse): boolean {
    type ExtendedServerResponce = ServerResponse & { locals?: any};
    return (res as ExtendedServerResponce)?.locals?.matchRootLevel?? false;
  }

  private static isLandingPagesMatch(res: ServerResponse): boolean {
    type ExtendedServerResponce = ServerResponse & { locals?: any};
    return (res as ExtendedServerResponce)?.locals?.matchLandingPages?? false;
  }

  private static setCacheHeaders(res: express.Response): void {
    res.removeHeader("Surrogate-Control");
    res.removeHeader("Pragma");
    res.removeHeader("Expires");
    res.setHeader("Cache-Control", "public,max-age=604800,immutable");
  }

  private readonly m_app: express.Application;
  private m_assetPath: StaticAssetPath = StaticAssetPath.TRANSPILED;
  private m_expressStaticMiddleware?: ReturnType<typeof expressStaticGzip> = undefined;
  private static readonly s_htmlExtension = ".html";
  private static readonly s_urlDevWebserver = "http://localhost:8080";
  private static readonly s_appleIcon = "apple-touch-icon.png";
  private static readonly s_robotsName = "robots.txt";
  private static readonly s_useDevWebserver = process.env["USE_DEV_WEBSERVER"] === "true";
  // Regex must be either simple or constructed using a library that provides DoS protection.
  private static readonly s_regexLandingPages = Server.getLandingPagesRegex();
  private static readonly s_regexArtifacts = Server.getClientBuildArtifactsRegex();
  private static readonly s_regexRootLevel = Server.getRootLevelRequestRegex();
  private static readonly s_expressStaticConfig: expressStaticGzip.ExpressStaticGzipOptions = {
    enableBrotli: true,
    index: false,
    orderPreference: ["br"],
    serveStatic: {
      cacheControl: true,
      etag: true,
      immutable: true,
      index: false,
      lastModified: false,
      maxAge: "7d",
      redirect: false,
      setHeaders: (res: express.Response, _path: string, _stat: any): void => {
        Server.setCacheHeaders(res);
      }
    }
  };
}

export default new Server().getApp;
