import { HTTPStatus } from "./http-status.interface";

export interface HTTPPayload {
  status: HTTPStatus;
  headers: Map<string, string | number>;
  body: string;
}