import { Command } from "../interfaces/command.interface";
import { CommandType } from "../enums/command-types.enum";
import { SubscribeCommand } from "../interfaces/subscribe-command.interface";
import { UnSubscribeCommand } from "../interfaces/unsubscribe-command.interface";
import { PublishCommand } from "../interfaces/publish-command.interface";

type KeyedObject = Command | SubscribeCommand | UnSubscribeCommand | PublishCommand;

const hasKey = <T extends KeyedObject>(obj: T, key: keyof T): boolean => {
  if (obj) return key in obj;
  return false;
}

export const commandParser = (command: Command): CommandType => {
  if (hasKey(command, 'subscribe')) {
    return CommandType.Subscribe;
  }
  if (hasKey(command, 'publish')) {
    return CommandType.Publish
  }
  if (hasKey(command, 'unsubscribe')) {
    return CommandType.UnSubscribe;
  }

  return CommandType.Error;
}