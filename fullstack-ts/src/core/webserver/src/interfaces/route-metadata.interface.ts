import { RouteHandler } from "../interfaces/route-handler.interface";

export interface RouteMetadata {
  params: Record<string, string>;
  handlers: RouteHandler[];
}