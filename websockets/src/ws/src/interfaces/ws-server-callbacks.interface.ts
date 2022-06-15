import { WSDataEvent } from "./ws-data-event.interface";
import { WSEvent } from "./ws-event.interface";

export type WSEventCallback = (event: WSEvent) => void;
export type WSDataEventCallback = (event: WSDataEvent) => void;

export interface WSServerCallbacks {
  data: WSDataEventCallback | null;
  close: WSEventCallback | null;
  connected: WSEventCallback | null;
};