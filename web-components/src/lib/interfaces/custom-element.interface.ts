import { html, Template } from "../render";

export abstract class CustomElement extends HTMLElement {
  render(): Template { return html``; }
  get css(): string { return ''; };

  componentWillMount(): void { }
  componentDidMount(): void { };

  componentWillUnmount(): void { };
  componentDidUnmount(): void { };

  componentDidUpdate(name: string, oldValue: string, newValue: string): void { }
  shouldComponentUpdate(name: string, oldValue: string, newValue: string): boolean { return true; }

}