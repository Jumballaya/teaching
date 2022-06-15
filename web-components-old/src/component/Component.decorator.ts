import { ComponentConfig } from "./component-config.interface";
import { createTemplateElement, setupLifecycleMethods, validateConfig } from "./helpers";

export const Component = (config: ComponentConfig) => (cls: CustomElementConstructor) => {
  // 1. Validate Component Config
  validateConfig(config);

  // 2. Build template element
  const template = createTemplateElement(config);

  // 3. Set up lifecycle methods
  setupLifecycleMethods(cls, template);

  // 4. Define the custom element
  window.customElements.define(config.selector, cls);
}