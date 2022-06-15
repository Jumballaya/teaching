import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

export const isDirectory = (basePath: string) => (f: string): boolean => {
  const fp = path.resolve(basePath, f);
  const stat = fs.lstatSync(fp);
  return stat.isDirectory();
}

export const prependDir = (basePath: string) => (f: string): string => path.resolve(basePath, f);

export const flatMap = <T>(arr: T[][]): T[] => {
  return Array.prototype.concat.apply(
    [],
    arr.map(x => x),
  );
};

export const getRecursiveFilelist = async (basePath: string, ext: string, depth = 10): Promise<string[]> => {
  const dir = await promisify(fs.readdir)(basePath);
  const otherDirs = dir.filter(isDirectory(basePath)).map(prependDir(basePath));
  const tests = dir.filter(f => f.endsWith(ext)).map(f => path.resolve(basePath, f));

  if (otherDirs.length > 0 && depth > 0) {
    const out = await Promise.all(
      otherDirs.map((dir) => getRecursiveFilelist(path.resolve(basePath, dir), ext, depth - 1)));
    return [...tests, ...flatMap(out)];
  }

  return tests;
}

interface CommandConfig {
  commands: Record<string, string[]>;
  args: string[];
}

export const parseArgv = (commandList: string[]): CommandConfig => {
  const commands: Record<string, string[]> = {};
  const args: string[] = [];
  const iter = commandList.slice(2).entries();
  let next = iter.next();
  while (!next.done) {
    const [_, entry] = next.value;
    const startsWithHyphen = entry.startsWith('-');
    const hasEqualSign = entry.includes('=');
    if (startsWithHyphen || hasEqualSign) {
      const command = entry.replace(/-/g, '');
      if (hasEqualSign) {
        const [k, v] = command.split('=');
        if (!commands[k]?.length) {
          commands[k] = [];
        }
        commands[k].push(v);
        next = iter.next();
        continue;
      }
      next = iter.next();
      const value = next.value[1];
      if (value) {
        if (!commands[command]?.length) {
          commands[command] = [];
        }
        commands[command].push(value);
        next = iter.next();
      }
      continue;
    }
    args.push(entry);
    next = iter.next();
  }

  return { commands, args };
}
