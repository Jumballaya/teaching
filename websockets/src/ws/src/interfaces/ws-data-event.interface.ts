import { WSEvent } from './ws-event.interface';
import { WSPayload } from "./ws-payload.interface";

export interface WSDataEvent extends WSEvent {
  data: WSPayload;
}