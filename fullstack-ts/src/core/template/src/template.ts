import { Stats } from "./interfaces/stats.interface";
import { renderTemplate } from "./utils";

export function Template<T>(templateString: string, data: T): Stats<T> {
  try {
    let render = '';
    let stats = renderTemplate(templateString, data);
    while (stats.rendered !== render) {
      render = stats.rendered;
      stats = renderTemplate(stats.rendered, data);
    }
    return stats;
  } catch (e) {
    console.error(e);
    return {
      raw: templateString,
      rendered: '',
      for: [],
      if: [],
      data,
    };
  }
}