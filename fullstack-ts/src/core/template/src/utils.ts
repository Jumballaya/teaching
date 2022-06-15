import { Stats } from "./interfaces/stats.interface";
import { buildStats, fillOutStats, generateMatchlist, renderStats } from "./stats";

export const getValue = <T>(key: string, data: any): T | null => {
  const chain = key.split('.');
  if (chain.length === 0) {
    return null;
  }
  const lastKey = chain[chain.length - 1];
  let val: any = data;
  let out: T | null = null;
  while (chain.length) {
    const key = chain.shift();
    if (key && val[key]) {
      val = val[key];
      if (key === lastKey) {
        out = val;
      }
    }
  }

  return out;
}

export const replaceValues = (tmpl: string, data: any): string => {
  const re = /{{([^}}]+)?}}/g;
  let out = tmpl;
  let match: any;
  while (match = re.exec(tmpl)) {
    const [replace, found] = match;
    const key = found.trim();
    const val = getValue<string>(key, data);
    if (val) {
      out = out.replace(replace, val);
    }
  }
  return out;
}

export const renderTemplate = function <T>(tmpl: string, data: T): Stats<T> {
  const defaultStats = { rendered: tmpl, raw: tmpl, if: [], for: [], data };
  if (tmpl === '') {
    return defaultStats;
  }
  const re = /{{%([^}}]+)?%}}/g;
  const matchList = generateMatchlist(tmpl, re);
  return renderStats(fillOutStats(buildStats(defaultStats, matchList)));
}
