import { Template } from "..";
import { IfStat } from "./interfaces/stats.interface";
import { getValue, renderTemplate } from "./utils";

export const generateIfStats = (stats: IfStat, tmpl: string, data: any): IfStat => {
  const _if = stats.if;
  const end = stats.end;

  if (stats.else) {
    const _else = stats.else;
    const startPos = _if.index + _if.raw.length;
    const elsePos = _else.index;
    const endPos = end?.index || 0;
    const ifBody = tmpl.slice(startPos, elsePos);
    const elseBody = tmpl.slice(elsePos + _else.raw.length, endPos);
    const renderedIfBody = handleIfStatement(_if.command, ifBody, elseBody, data);
    const rawString = tmpl.slice(_if.index, endPos + (end?.raw.length || 0));
    stats.rendered = renderedIfBody;
    stats.raw = rawString;
    stats.if.body = ifBody;
    stats.else.body = elseBody;
    return stats;
  }

  const startPos = _if.index + _if.raw.length;
  const endPos = end?.index || 0;
  const ifBody = tmpl.slice(startPos, endPos);
  const renderedIfBody = handleIfStatement(_if.command, ifBody, '', data);
  stats.rendered = renderedIfBody;
  const rawString = tmpl.slice(_if.index, endPos + (end?.raw.length || 0));
  stats.rendered = renderedIfBody;
  stats.raw = rawString;
  stats.if.body = ifBody;
  return stats;
}

export const handleIfStatement = (statement: string, ifBody: string, elseBody: string, data: any): string => {
  const tokens = statement
    .split(' ')
    .map(t => t.trim())
    .filter(x => x);

  let success = false;
  if (tokens.length === 2) {
    const ident = tokens[1];
    try {
      const jsonVal = JSON.parse(ident);
      success = !!jsonVal;
    } catch (_) {
      const got = getValue<any>(ident, data);
      success = !!got;
    }
  }

  if (tokens.length === 3 && tokens[1] === 'not') {
    const ident = tokens[2];
    try {
      const jsonVal = JSON.parse(ident);
      success = !jsonVal;
    } catch (_) {
      const got = getValue<any>(ident, data);
      success = !got;
    }
  }

  if (tokens.length === 4) {
    const ident = tokens[1];
    const value = tokens[3];
    const savedVal = getValue<any>(value, data);
    const got = getValue<any>(ident, data);
    if (savedVal) {
      success = got === savedVal;
    } else {
      success = JSON.stringify(got) === value;
    }
  }

  if (tokens.length === 5 && tokens[3] === 'not') {
    const ident = tokens[1];
    const value = tokens[4];
    const got = getValue<any>(ident, data);
    const savedVal = getValue<any>(value, data);
    if (savedVal) {
      success = got !== savedVal;
    } else {
      success = JSON.stringify(got) !== value;
    }
  }

  if (success) {
    return Template(ifBody, data).rendered;
  }
  return Template(elseBody, data).rendered;
}