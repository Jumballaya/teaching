import { Template } from "..";
import { ForStat } from "./interfaces/stats.interface";
import { getValue } from "./utils";

export const handleForStatement = (statement: string, body: string, data: any): string => {
  const tokens = statement
    .split(' ')
    .map(c => c.trim())
    .filter(x => x);

  if (tokens.length !== 4) {
    return '';
  }

  const ident = tokens[1];
  const key = tokens[3];
  const val = getValue<Iterable<any>>(key, data);
  let out = '';
  if (val) {
    for (let v of val) {
      data[ident] = v;
      const stats = Template(body, { ...data, [ident]: v });
      out += stats.rendered;
    }
  }

  return out;
}

export const generateForStats = (stats: ForStat, tmpl: string, data: any): ForStat => {
  const start = stats.start;
  const end = stats.end;
  const startPos = start.index + start.raw.length;
  const endPos = end?.index || 0;
  const forBody = tmpl.slice(startPos, endPos);
  const renderedForBody = handleForStatement(start.command, forBody, data);
  const rawString = tmpl.slice(start.index, endPos + (end?.raw.length || 0));
  stats.rendered = renderedForBody;
  stats.body = forBody;
  stats.raw = rawString;
  return stats;
}
