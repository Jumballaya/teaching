import { HTTPPayload } from "./http-payload.interface";

export interface HandshakeRequest {
  key: string;
  version: number;
  origin: string;
  req: HTTPPayload;
}
