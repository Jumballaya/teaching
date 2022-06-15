import { RouteConfig } from "./interfaces/route-config.interface";
import { RouteMetadata } from "./interfaces/route-metadata.interface";
import { RouteMatcher } from "./matcher/RouteMatcher";
import { RouteHandler } from "./interfaces/route-handler.interface";
import { RouteMethod } from "./types/route-method.type";

export class Router {

  private routes: Map<RouteMethod, RouteConfig[]> = new Map();

  public getHandlerMetadata(method: RouteMethod, path: string, basePath: string): RouteMetadata | null {
    const routes = this.routes.get(method);
    if (routes === undefined) {
      return null;
    }
    const [route, params] = this.getMatchingRoute(path, basePath, routes);
    if (route) {
      const { handlers } = route;
      return { handlers, params };
    }
    return null;
  }

  public get(path: string, ...handlers: RouteHandler[]): void {
    this.pushRoute('get', path, handlers)
  }

  public post(path: string, ...handlers: RouteHandler[]): void {
    this.pushRoute('post', path, handlers)
  }

  public put(path: string, ...handlers: RouteHandler[]): void {
    this.pushRoute('put', path, handlers)
  }

  public patch(path: string, ...handlers: RouteHandler[]): void {
    this.pushRoute('patch', path, handlers)
  }

  public delete(path: string, ...handlers: RouteHandler[]): void {
    this.pushRoute('delete', path, handlers)
  }

  public options(path: string, ...handlers: RouteHandler[]): void {
    this.pushRoute('options', path, handlers)
  }

  private pushRoute(method: RouteMethod, _path: string, handlers: RouteHandler[]) {
    const path = this.formatPath(_path);
    if (!this.routes.get(method)) {
      this.routes.set(method, []);
    }
    const routeHandlers: RouteConfig[] = this.routes.get(method) || [];
    routeHandlers.push({ method, path, handlers });
    this.routes.set(method, routeHandlers);
  }

  private formatPath = (_path: string): string => {
    let path = _path;
    path = path.startsWith('//') ? path.slice(1) : path;
    path = path.endsWith('//') ? path.slice(0, path.length - 1) : path;
    return path;
  }

  private getMatchingRoute(
    path: string,
    basePath: string,
    routes: RouteConfig[],
  ): [RouteConfig | null, Record<string, string>] {
    const matcher = new RouteMatcher(path);
    let config: RouteConfig | null = null;
    let matches: Record<string, string> = {};
    for (const route of routes) {
      const pattern = this.formatPath(basePath + route.path);
      const match = matcher.matches(pattern);
      if (match) {
        matches = match;
        config = route;
        break;
      }
    }
    return [config, matches];
  }

}