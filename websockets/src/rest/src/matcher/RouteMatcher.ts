import { Lexer } from "./Lexer";

export class RouteMatcher {

  private pattern: string;
  private routeLexer: Lexer;

  constructor(pattern: string) {
    this.pattern = pattern.replace(/\/$/, '');
    this.routeLexer = new Lexer(this.pattern);
  }


  public matches(path: string): Record<string, string> | null {
    if (this.straightMatch(path)) {
      return {};
    }
    const routeTokens = this.routeLexer.getTokens();
    const symLexer = new Lexer(path);
    const symTokens = symLexer.getTokens();
    if (symTokens.length !== routeTokens.length) {
      return null;
    }
    let out: Record<string, string> | null = null;
    for (const [index, symToken] of symTokens.entries()) {
      const routeToken = routeTokens[index];
      if (routeToken.type === '/' && symToken.type === '/') {
        continue;
      }
      if (symToken.type === ':') {
        if (routeToken.type === 'path') {
          if (out === null) {
            out = {};
          }
          out[symToken.value] = routeToken.value;
        }
      }
    }

    return out;
  }


  private straightMatch(path: string): boolean {
    const withoutSlash = this.pattern === path;
    const withSlash = this.pattern === path.replace(/\/$/, '');
    return withoutSlash || withSlash;
  }

}