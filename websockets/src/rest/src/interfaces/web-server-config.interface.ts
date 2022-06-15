import { RouteHandler } from "./route-handler.interface";

export interface WebServerConfig {
  host?: string;
  useLogger?: boolean;
  logger?: RouteHandler;
  useStatic?: boolean;
  static?: {
    urlPath: string;
    filePath: string;
  };
}