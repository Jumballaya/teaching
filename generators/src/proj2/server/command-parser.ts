import { Command } from "./interfaces/command.interface";
import { CommandType } from "./types/command-types.type";

const hasKey = (obj: any, key: string): boolean => {
  return obj && obj.hasOwnProperty(key) && obj[key];
}

export const commandParser = (command: Command): CommandType => {
  if (hasKey(command, 'collection')) {
    return parseCollectionCommands(command);
  }
  if (hasKey(command, 'entry')) {
    return parseEntryCommands(command);
  }
  return 'error';
}

const parseCollectionCommands = (command: Command): CommandType => {
  if (hasKey(command.collection, 'create')) {
    return 'collection:create';
  }
  if (hasKey(command.collection, 'read')) {
    return 'collection:read';
  }
  if (hasKey(command.collection, 'update')) {
    return 'collection:update';
  }
  if (hasKey(command.collection, 'delete')) {
    return 'collection:delete';
  }
  return 'error';
}

const parseEntryCommands = (command: Command): CommandType => {
  if (hasKey(command.entry, 'create')) {
    return 'entry:create';
  }
  if (hasKey(command.entry, 'read')) {
    return 'entry:read';
  }
  if (hasKey(command.entry, 'update')) {
    return 'entry:update';
  }
  if (hasKey(command.entry, 'delete')) {
    return 'entry:delete';
  }
  return 'error';
}