import { evtRegex } from "./evt.regex";
import { Template } from "./interfaces/template.interface";


const applyListener = (markup: Template, el: Element | DocumentFragment): void => {
  for (const node of el.children) {
    for (const attrName of node.getAttributeNames()) {
      const match = (attrName + '=').match(evtRegex);
      if (match) {
        const val = node.getAttribute(attrName);
        if (val && val in markup.handlers) {
          const handler = markup.handlers[val];
          if (handler) {
            node.addEventListener(handler.type, handler.handler.bind(node));
            node.removeAttribute(attrName);
          }
        }
      }
    }
    if (node.hasChildNodes()) {
      for (const child of node.children) {
        applyListener(markup, child);
      }
    }
  }
}

export const render = (tmpl: Template, css: string = ''): DocumentFragment => {
  const $template = document.createElement('template');
  $template.innerHTML = css.length > 0 ? `<style>${css}</style>${tmpl.markup}` : tmpl.markup;
  applyListener(tmpl, $template.content);
  return $template.content;
}