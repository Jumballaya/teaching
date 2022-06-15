import { Attribute, Component, CustomElement, html, Template } from "../lib";


@Component('test-component')
export class TestComponent extends CustomElement {
  @Attribute() maxwidth = 600;
  @Attribute() route = 'Test Data Here';
  @Attribute() mode = 'dark';

  private data = ['apple', 'banana', 'lion', 'tiger', 'books'];


  get css(): string {
    return `

      :host([mode="dark"]) {
        --bg--color: var(--color--dark);
        --txt--color: var(--color--light);
      }

      :host([mode="light"]) {
        --bg--color: var(--color--light);
        --txt--color: var(--color--dark);
      }

      :host {
        --color--light: #fafafa;
        --color--dark: #222;

        font-family: sans-serif;

        display: block;
        background-color: var(--bg--color);
        color: var(--txt--color);
        padding: 32px;
      }

      button {
        background-color: var(--bg--color);
        border: 1px solid var(--txt--color);
        padding: 8px;
        color: var(--txt--color);
        transition: all 250ms ease-in-out;
      }

      button:hover {
        cursor: pointer;
        background-color: var(--txt--color);
        color: var(--bg--color); 
      }

      form {
        max-width: ${this.maxwidth}px;
        margin: 0 auto;
        border: 1px solid var(--txt--color);
        padding: 12px;
      }

      fieldset {
        border: 1px solid var(--txt--color);
        margin: 4px 0;
        padding: 18px;
      }

      input[type="email"],
      input[type="password"],
      input[type="number"] {
        border: 1px solid var(--txt--color);
        color: var(--txt--color);
        background-color: var(--bg--color); 
        padding: 4px 8px;
      }
    `
  }

  public handleSubmit(e: Event) {
    e.preventDefault();
    this.setAttribute('mode', this.mode === 'dark' ? 'light' : 'dark');
  }

  public handleClickItem(e: Event, ...params: any[]) {
    console.log(params);
  }

  public handleKeyDown(e: KeyboardEvent) {
    const data = (e?.target as HTMLInputElement)?.value;
    const out = this.shadowRoot?.querySelector('[name="out"]');
    if (out) out.innerHTML = data;
  }

  public setWidth(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.value && parseInt(target.value) > 0) {
      this.setAttribute('maxwidth', target.value);
    }
  }

  public renderListItem = (value: string, index: number): Template => {
    const span = html`<span @click=${() => { console.log(index); }}>${this.mode}</span>`;
    return html`<li>${value} -- ${span}</li>`;
  }

  public render() {
    return html`
      <ul>
        ${this.data.map(this.renderListItem)}
      </ul>
      <form @submit=${this.handleSubmit}>
        <fieldset>
          <label for="email">Email:</label>
          <input @keyup=${this.handleKeyDown} type="email" name="email">
          <label for="password">Password:</label>
          <input @keyup=${this.handleKeyDown} type="password" name="password">
          <output name="out">
        </fieldset>
        <fieldset>
          <input 
            @change=${this.setWidth.bind(this)}
            type="number"
            name="width"
            value="${this.maxwidth}"
          >
        </fieldset>
        <fieldset>
          <button @click=${this.handleSubmit.bind(this)}>Submit</button>
        </fieldset>
      </form>`;
  }

}