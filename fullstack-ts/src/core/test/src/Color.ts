
export class Color {

  static colors = {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    reset: '\x1b[0m',
  };

  static reset(): string {
    return this.colors.reset;
  }

  static black(message: string): string {
    return this.colors.black + message;
  }
  static red(message: string): string {
    return this.colors.red + message;
  }
  static green(message: string): string {
    return this.colors.green + message;
  }
  static yellow(message: string): string {
    return this.colors.yellow + message;
  }
  static blue(message: string): string {
    return this.colors.blue + message;
  }
  static magenta(message: string): string {
    return this.colors.magenta + message;
  }
  static cyan(message: string): string {
    return this.colors.cyan + message;
  }
  static white(message: string): string {
    return this.colors.white + message;
  }

}