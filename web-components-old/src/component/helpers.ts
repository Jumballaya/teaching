import { ComponentConfig } from "./component-config.interface";

// Creates a Template Element from a Component Config
export const createTemplateElement = (config: ComponentConfig): HTMLTemplateElement => {
  let html = config.template || '';
  if (config.style) {
    html = `<style>${config.style}</style>
    ${config.template}`;
  }

  const template = document.createElement('template');
  template.innerHTML = html;
  return template;
}

// Check if a custom element selector is in a valid format
const selectorIsValid = (selector: string): boolean => {
  return selector.includes('-');
}

// Validate a Component Config
export const validateConfig = (config: ComponentConfig): void => {
  validateSelector(config);
}

// Validate a Component Selector
const validateSelector = (config: ComponentConfig): void => {
  if (!selectorIsValid(config.selector)) {
    throw new Error('Component selector must include at least 1 dash');
  }
}

// Setup all lifecycle methods
export const setupLifecycleMethods = (
  cls: CustomElementConstructor,
  template: HTMLTemplateElement
) => {
  setupConnectedCallback(cls, template);
  setupDisconnectedCallback(cls);
  setupAttributeChangedCallback(cls);
}

// Setup 'Connected' lifecycle methods (Will Mount, Mounting, and Did Mount)
const setupConnectedCallback = (
  cls: CustomElementConstructor,
  template: HTMLTemplateElement,
) => {
  // 1. Get the connected call back (Mounting) and edit it
  const connectedCallback = cls.prototype.connectedCallback || function () { };
  cls.prototype.connectedCallback = function () {
    const clone = document.importNode(template.content, true);
    this.attachShadow({ mode: 'open' }).appendChild(clone);

    // 1a. Will Mount
    if (this.componentWillMount) {
      this.componentWillMount();
    }

    // 1b. Mounting
    connectedCallback.call(this);

    // 1c. Did Mount
    if (this.componentDidMount) {
      this.componentDidMount();
    }
  }
}

// Setup 'Disconnect' lifecycle method (Will Unmount, Unmounting, and Did Unmount)
const setupDisconnectedCallback = (cls: CustomElementConstructor) => {
  // 1. Get the disconnected call back (Unmounting) and edit it
  const disconnectedCallback = cls.prototype.disconnectedCallback || function () { };
  cls.prototype.disconnectedCallback = function () {
    // 1a. Will Unmount
    if (this.componentWillUnmount) {
      this.componentWillUnmount();
    }

    // 1b. Unmounting
    disconnectedCallback.call(this);

    // 1c. Did Unmount
    if (this.componentDidUnmount) {
      this.componentDidUnmount();
    }
  }
}

// Setup attribute changed  callback
const setupAttributeChangedCallback = (cls: CustomElementConstructor) => {
  // 1. Get the current attributeChangedCallback
  const attrChangedCallback = cls.prototype.attributeChangedCallback || function () { };
  cls.prototype.attributeChangedCallback = function (attrName: any, oldValue: any, newValue: any) {
    if (newValue !== oldValue) {
      this[attrName] = newValue;
    }
    attrChangedCallback.call(this, attrName, oldValue, newValue);
  }
}