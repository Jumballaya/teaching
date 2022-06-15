import { PublishCommand } from "./publish-command.interface";
import { SubscribeCommand } from "./subscribe-command.interface";
import { UnSubscribeCommand } from "./unsubscribe-command.interface";

export interface Command {
  publish?: PublishCommand;
  unsubscribe?: UnSubscribeCommand;
  subscribe?: SubscribeCommand;
}