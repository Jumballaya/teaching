import http, { IncomingMessage, Server, ServerResponse } from "http";
import { Request } from "./Request";
import { Response } from "./Response";
import { RouteMetadata } from "./interfaces/route-metadata.interface";
import { Router } from "./Router";
import { RouteMethod } from "./types/route-method.type";
import { createNextFunction, defaultRoute, errorRoute, fileRoute, logRoute } from "./utils";
import { WebServerConfig } from "./interfaces/web-server-config.interface";
import { RouteHandler } from "./interfaces/route-handler.interface";

const defaultConfig: WebServerConfig = {
  host: 'localhost',
  useLogger: true,
  logger: logRoute,
  useStatic: false,
};

export class WebServer {

  private server: Server = http.createServer(this.listener.bind(this));
  private routers: Array<{ base: string; router: Router }> = [];
  private config: WebServerConfig = defaultConfig;
  private port = 0;

  constructor(config?: WebServerConfig) {
    this.config = {
      ...this.config,
      ...config,
    };
    if (config?.useStatic && config.static) {
      this.useStatic(config.static?.filePath, config.static?.urlPath);
    }
  }

  public use(path: string, router: Router) {
    this.routers.push({ base: path, router });
  }

  public listen(port: number, cb?: () => void) {
    this.port = port;
    const host = this.config.host || defaultConfig.host;
    return this.server.listen(port, host, undefined, cb);
  }

  public useLogger(logger: RouteHandler | null): void {
    if (logger) {
      this.config.logger = logger;
      this.config.useLogger = true;
    } else {
      this.config.useLogger = false;
    }
  }

  public useStatic(filePath: string, urlPath: string) {
    this.config.static = { filePath, urlPath };
    this.config.useStatic = true;

    const staticRouter = new Router();
    staticRouter.get('/:filename', fileRoute(filePath));

    this.use(urlPath, staticRouter);
  }

  private listener(req: IncomingMessage, res: ServerResponse) {

    // Read the body of the request
    let bodyBuffers: Buffer[] = [];
    req.on('readable', () => {
      const read: Buffer = req.read();
      if (read) {
        bodyBuffers.push(read);
      }
    });

    // On End: We received the full request payload
    req.on('end', () => {
      const body = Buffer.concat(bodyBuffers);
      this.handleRequestResponse(req, res, body);
    })
  }

  private handleRequestResponse(req: IncomingMessage, res: ServerResponse, body: Buffer): void {
    const path = req.url || '/';
    const url = new URL(`http://${this.config.host}:${this.port}${path}`);
    const method = req.method?.toLowerCase() as RouteMethod;
    const route = this.getRoute(method, url.pathname);
    const { handlers } = route;

    // Set up request/response/next objects
    const request = new Request(req, route, body);
    const response = new Response(res);
    const next = createNextFunction(handlers, request, response);

    try {

      // Run the route(s)
      handlers[0](request, response, next);

    } catch (e: any) {

      // Catch and report errors
      const params = { message: e?.message || 'Unknown Error' };
      const errorRequest = new Request(req, route, Buffer.from(''));
      errorRequest.params = params;

      // Make sure we can write to the socket before we continue
      if (res.writableEnded) {
        console.log('\n', e, '\n');
        return;
      }

      // If we can still write to the socket, print the error
      errorRoute(errorRequest, response);
    }

    // Run the logger
    const logger = this.config.useLogger ? this.config.logger : undefined;
    if (logger) {
      logger(request, response);
    }
  }

  private getRoute(method: RouteMethod, path: string): RouteMetadata {
    let metadata: RouteMetadata = {
      params: {},
      handlers: [defaultRoute],
    };

    for (const meta of this.routers) {
      const { base, router } = meta;
      const data = router.getHandlerMetadata(method, path, base);
      if (data) {
        metadata = data;
        break;
      }
    }

    return metadata;
  }
}
