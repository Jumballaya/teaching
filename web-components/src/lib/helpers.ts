import { html, render } from "./render";

export const setupConnectedCallback = (customElementCtor: CustomElementConstructor) => {
  const callback = customElementCtor.prototype.connectedCallback;
  customElementCtor.prototype.connectedCallback = function () {
    // BEFORE RENDERING
    if (this.componentWillMount) {
      this.componentWillMount();
    }
    this.attachShadow({ mode: 'open' })
      .appendChild(render(this.render(), this.css || ''));

    const attrList: string[] = Reflect.getMetadata('attrList', customElementCtor) || [];
    for (const attr of attrList) {
      if (this[attr]) {
        if (typeof this[attr] === 'object') {
          this.setAttribute(attr, JSON.stringify(this[attr]));
        } else {
          this.setAttribute(attr, this[attr]);
        }
      }
    }

    if (callback) {
      callback();
    }

    // AFTER RENDERING
    if (this.componentDidMount) {
      this.componentDidMount();
    }
  }
}

export const setupDisconnectCallback = (customElementCtor: CustomElementConstructor) => {
  const callback = customElementCtor.prototype.disconnectedCallback;
  customElementCtor.prototype.disconnectedCallback = function () {
    // BEFORE DELETING ELEMENTS
    if (this.componentWillUnmount) {
      this.componentWillUnmount();
    }

    if (callback) {
      callback();
    }

    // AFTER DELETING ELEMENTTS
    if (this.componentDidUnmount) {
      this.componentDidUnmount();
    }
  }

}

export const setupAttributeChangedCallback = (customElementCtor: CustomElementConstructor) => {
  const attrList: string[] = Reflect.getMetadata('attrList', customElementCtor) || [];
  attrList.unshift('id', 'class');
  const list = Array.from(new Set(attrList));
  const observedAttributes = {
    get: function () {
      return list;
    }
  };
  let lastMarkup = '';
  let lastCss = '';
  Object.defineProperty(customElementCtor, 'observedAttributes', observedAttributes);
  customElementCtor.prototype.attributeChangedCallback = async function (
    name: string,
    oldValue: string,
    newValue: string
  ) {
    const shouldUpdate = this.shouldComponentUpdate(name, oldValue, newValue);

    if (shouldUpdate) {
      this[name] = newValue;
      await this.componentDidUpdate(name, oldValue, newValue);
    }

    if ((lastCss !== this.css) && shouldUpdate) {
      lastCss = this.css
      const $style = this.shadowRoot.querySelector('style');
      if ($style) $style.innerHTML = this.css
    }

    const nextRender = render(this.render(), this.css);
    const nextMarkup = nextRender.textContent || '';
    if (lastMarkup !== nextMarkup && shouldUpdate) {
      this.shadowRoot.innerHTML = '';
      lastMarkup = nextMarkup;
      this.shadowRoot.appendChild(nextRender);
    }

  }
}
