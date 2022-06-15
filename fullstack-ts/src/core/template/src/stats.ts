import { generateForStats } from "./for-statement";
import { generateIfStats } from "./if-statement";
import { Stats, Entry } from "./interfaces/stats.interface";
import { replaceValues } from "./utils";

export const generateMatchlist = (tmpl: string, re: RegExp) => {
  const matches: Array<RegExpExecArray | null> = [];
  let match: RegExpExecArray | null;
  while (match = re.exec(tmpl)) {
    matches.push(match);
  }

  const entryList = matches.filter(m => m) as RegExpExecArray[];
  const matchList: Array<Entry> = entryList
    .map(m => ({
      raw: m[0],
      command: m[1].trim(),
      index: m.index,
    }));
  return matchList
}

export const splice = (tmpl: string, raw: string, rendered: string): string => {
  return tmpl.replace(raw, rendered);
}

export const buildStats = (stats: Stats<any>, matchList: Array<Entry>): Stats<any> => {
  return matchList.reduce((acc, cur) => {
    if (cur.command.startsWith('for ')) {
      acc.for.push({ start: cur, rendered: '', raw: '', body: '' })
    }
    if (cur.command === 'endfor') {
      const lastIndex = acc.for.length - 1;
      let latestFor = acc.for[lastIndex];
      if (latestFor) {
        let i = 2;
        while (Object.keys(latestFor.end || {}).length > 0) {
          if (acc.for.length <= i) break;
          latestFor = acc.for[acc.for.length - i];
          i++;
        }
        latestFor.end = cur;
        acc.for[lastIndex] = latestFor;
      }
    }

    if (cur.command.startsWith('if ')) {
      acc.if.push({
        if: { ...cur, body: '' },
        rendered: '',
        raw: '',
      });
    }

    if (cur.command === 'else') {
      const lastIndex = acc.if.length - 1;
      const latestIf = acc.if[lastIndex];
      if (latestIf) {
        latestIf.else = { ...cur, body: '' };
        acc.if[lastIndex] = latestIf;
      }
    }

    if (cur.command === 'endif') {
      const lastIndex = acc.if.length - 1;
      const latestIf = acc.if[lastIndex];
      if (latestIf) {
        latestIf.end = cur;
        acc.if[lastIndex] = latestIf;
      }
    }


    return acc;
  }, stats);
}

export const fillOutStats = (stats: Stats<any>): Stats<any> => {
  const tmpl = stats.raw;
  const data = stats.data;


  console.log(stats);


  for (let [index, ifStats] of stats.if.entries()) {
    stats.if[index] = generateIfStats(ifStats, tmpl, data);
  }

  for (let [index, forStats] of stats.for.entries()) {
    stats.for[index] = generateForStats(forStats, tmpl, data);
  }

  return stats;
}

export const renderStats = (stats: Stats<any>): Stats<any> => {
  for (const _if of stats.if) {
    const { raw, rendered } = _if;
    stats.rendered = splice(stats.rendered, raw, rendered)
  }

  for (const _for of stats.for) {
    const { raw, rendered } = _for;
    stats.rendered = splice(stats.rendered, raw, rendered)
  }

  stats.rendered = replaceValues(stats.rendered, stats.data);

  return stats;
}