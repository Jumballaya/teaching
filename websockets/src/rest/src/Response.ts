import { ServerResponse } from "http";

export class Response {

  private headers: Map<string, string> = new Map();
  private status = 200;

  constructor(private readonly res: ServerResponse) { }

  public setHeaders(headers: Record<string, string>) {
    for (const key in headers) {
      const value = headers[key];
      this.headers.set(key, value);
    }
  }

  public setStatus(status: number) {
    this.status = status;
  }

  public getStatus(): number {
    return this.res.statusCode;
  }

  public json(data: Record<string | number, unknown>) {
    this.headers.set('Content-Type', 'application/json');
    this.send(JSON.stringify(data, null, 2));
  }

  public raw(data: Buffer) {
    this.headers.set('Content-Type', 'application/octet-stream');
    this.send(data);
  }

  public send(data: unknown) {
    if (typeof data === 'string') {
      this._send(data);
      return;
    }
    this._send(JSON.stringify(data, null, 2));
  }

  private _send(data: unknown) {
    const headers = Object.fromEntries(this.headers);
    this.res.writeHead(this.status, '', headers);
    if (this.res.writableEnded) {
      throw new Error('Unable to write to a closed socket');
    }
    this.res.end(data);
  }
}
