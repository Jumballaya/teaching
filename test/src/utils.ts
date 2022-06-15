import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

export const isDirectory = (basePath: string) => (f: string): boolean => {
  const stat = fs.lstatSync(path.resolve(basePath, f));
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
