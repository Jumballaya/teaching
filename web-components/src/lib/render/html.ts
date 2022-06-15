import { evtRegex } from "./evt.regex";
import { HandlerEntry } from "./interfaces/handler-entry.interface";
import { Template } from "./interfaces/template.interface";

export const html = (strings: TemplateStringsArray, ...values: any[]): Template => {
  let handlers: Template['handlers'] = {};
  let markup = '';
  const raw = [...strings.raw];
  for (const [i, s] of strings.entries()) {
    const match = s.match(evtRegex);
    if (match) {
      const id = crypto.randomUUID();
      const handler = values[i] as HandlerEntry['handler'] | undefined;
      if (handler) {
        const type = match[0].replace('@', '').replace('=', '') as HandlerEntry['type'];
        handlers[id] = { type, handler };
        markup += s + `"${id}"`;
        continue;
      }
    }
    const v = values[i];
    if (v?.handlers && v?.markup) {
      markup += s + v.markup;
      raw.push(...v.raw);
      handlers = { ...handlers, ...v.handlers };
      continue;
    }
    if (v instanceof Array) {
      markup += s;
      for (const h of v) {
        markup += h.markup;
        raw.push(...h.raw);
        handlers = { ...handlers, ...h.handlers };
      }
      continue;
    }
    markup += s + (v ? v : '');
  }

  return {
    raw,
    markup,
    handlers,
  };
}