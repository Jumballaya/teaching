import { Component } from "../component/Component.decorator";

const template = `
<h1 id="time"></h1>
<button id="btn">Click Me</button>
`

const style = `
  #time {
    color: purple;
  }

  button {
    border: 0;
    font-size: 20px;
  }

  button:hover {
    border: 1px solid red;
    cursor: pointer;
  }
`

@Component({
  selector: 'hello-world',
  template,
  style,
})
export class HelloWorld extends HTMLElement {

  private t = Date.now();
  private interval: number = -1;

  static get observedAttributes() {
    return ['time'];
  }

  set time(time: number) {
    this.t = time;
    this.setAttribute('time', this.t.toString());
  }

  get time(): number {
    return this.t;
  }

  attributeChangedCallback(name: string, old: any, newValue: any) {
    if (name === 'time') {
      this.renderTime();
    }
  }

  connectedCallback() {
    this.interval = window.setInterval(() => {
      this.setAttribute('time', Date.now().toString());
    }, 10);

    const btn = this.shadowRoot?.querySelector('#btn');
    btn?.addEventListener('click', () => {
      this.handleClose();
    });
    this.renderTime();
  }

  disconnectedCallback() {
    window.clearInterval(this.interval);
  }

  handleClose() {
    if (this.interval !== -1) {
      window.clearInterval(this.interval);
      this.interval = -1;
    }
  }

  renderTime() {
    const t = this.shadowRoot?.querySelector('#time');
    if (t) t.innerHTML = this.time.toString();
  }
}