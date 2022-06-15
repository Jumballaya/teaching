import { RouteHandler } from "../interfaces/route-handler.interface";
import { RouteMethod } from "../types/route-method.type";

export interface RouteConfig {
  path: string;
  handlers: RouteHandler[];
  method: RouteMethod;
}