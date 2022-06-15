import { IncomingHttpHeaders, IncomingMessage } from "http";
import { RouteMetadata } from "./interfaces/route-metadata.interface";
import { parseBody } from "./utils";

export class Request {
  public params: Record<string, string> = {};
  public headers: IncomingHttpHeaders = {};
  public body: Record<string, any> = {};
  public query: Record<string, any> = {};

  public payload: Map<string, unknown> = new Map();

  constructor(public req: IncomingMessage, route: RouteMetadata, _body: Buffer) {
    const contentType = req.headers['content-type'] || 'text/plain';
    this.body = parseBody(contentType, _body);
    this.params = route?.params || {};
    this.headers = req.headers;
    this.query = this.parseQueryParams(req);
  }

  public set(key: string, value: any) {
    this.payload.set(key, value);
  }

  public get<T>(key: string): T | undefined {
    return this.payload.get(key) as T;
  }

  private parseQueryParams(req: IncomingMessage): Record<string, any> {
    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    return Array.from(url.searchParams.keys()).reduce((acc, k) => {
      return {
        ...acc,
        [k]: url.searchParams.get(k),
      };
    }, {});
  }

}