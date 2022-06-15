import { setupAttributeChangedCallback, setupConnectedCallback, setupDisconnectCallback } from './helpers';

export const Component = (selector: `${string}-${string}`) =>
  (customElementCtor: CustomElementConstructor) => {
    setupConnectedCallback(customElementCtor);
    setupDisconnectCallback(customElementCtor);
    setupAttributeChangedCallback(customElementCtor);
    window.customElements.define(selector, customElementCtor);
  }