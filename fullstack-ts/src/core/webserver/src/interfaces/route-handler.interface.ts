import { Request } from "../Request";
import { Response } from "../Response";
import { NextFunction } from "./next-function.interface";

export interface RouteHandler {
  (req: Request, res: Response, next?: NextFunction): void;
}

