import { Token } from "./interfaces/token.interface";

const validPath = (c: string): boolean => {
  return c !== ':'
    && c !== '/'
    && c !== '?';
}

export class Lexer {

  private tokens: Token[] = [];

  private cursor = 0;

  constructor(private readonly input: string) {
    this.start();
  }

  public getTokens(): Token[] {
    return [...this.tokens];
  }

  private incCursor() {
    this.cursor++;
  }

  private getCurrent(): string {
    return this.input[this.cursor];
  }

  private parsePath(): string {
    let cur = this.getCurrent();
    const start = this.cursor;
    while (validPath(cur) && this.cursor < this.input.length) {
      this.incCursor();
      cur = this.getCurrent();
    }
    return this.input.slice(start, this.cursor);
  }

  private start() {
    if (this.cursor >= this.input.length) {
      return;
    }
    const value = this.getCurrent();

    switch (value) {

      case '/': {
        const type = '/';
        const value = '/';
        this.tokens.push({ type, value });
        this.incCursor();
        break;
      }

      case ':': {
        const type = ':';
        this.incCursor();
        const value = this.parsePath();
        this.tokens.push({ type, value });
        break;
      }

      // Remove query params
      case '?': {
        this.cursor = this.input.length;
      }

      default: {
        const value = this.parsePath();
        if (value !== '') {
          const type = 'path';
          this.tokens.push({ type, value })
        }
        break;
      }
    }

    this.start();
  }

}