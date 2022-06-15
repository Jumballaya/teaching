import { HandlerEntry } from "./handler-entry.interface";

export interface Template {
  raw: readonly string[];
  markup: string;
  handlers: Record<string, HandlerEntry>;
}