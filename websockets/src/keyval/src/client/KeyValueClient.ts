import net from "net";
import { KeyValueResponse } from "../interfaces/key-value-response.interface";
import { KeyValueCollection } from "./KeyValueCollection";

type DataListener<T = any> = (chunk: T) => void;

export class KeyValueClient {

  private socket: net.Socket | null = null;
  private host: string;
  private port: number;
  private listener: DataListener | null = null;

  constructor(opts: net.TcpNetConnectOpts | URL | string) {
    const [host, port] = this.constructOptions(opts);
    this.host = host;
    this.port = port;
    this.socket = this.connect();
  }

  public close() {
    if (this.socket) {
      if (this.socket.writable) {
        this.socket.end();
      }
      this.socket = null;
    }
  }

  public async createCollection<T>(name: string): Promise<KeyValueCollection<T>> {
    const command = JSON.stringify({
      collection: {
        create: {
          name,
        }
      }
    });
    const res = await this.send<KeyValueResponse>(command);
    if (res.success) {
      return new KeyValueCollection(this, name);
    }
    if (res.message?.includes('already exists')) {
      return new KeyValueCollection(this, name);
    }
    throw new Error(res.message);
  }

  public async getCollection<T>(name: string): Promise<KeyValueCollection<T>> {
    const command = JSON.stringify({
      collection: {
        read: {
          name,
        }
      }
    });
    const res = await this.send<KeyValueResponse>(command);
    if (res.success) {
      return new KeyValueCollection(this, name);
    }
    return this.createCollection(name);
  }

  public send<T>(data: string): Promise<T> {
    return new Promise((resolve) => {
      if (this.socket) {
        if (this.listener) {
          this.socket.removeListener('data', this.listener);
        }
        this.listener = this.dataListener(resolve);
        this.socket.on('data', this.listener);
        this.socket.write(data);
      }
    })
  }

  private dataListener<T>(resolve: (evt: T) => void) {
    return (data: string) => {
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        console.log(e);
      }
    }
  }

  private connect(): net.Socket {
    const socketWritable = this.socket ? this.socket.writable : false;
    if (this.socket === null || !socketWritable) {
      const { host, port } = this;
      return net.createConnection({ host, port }, this.onConnect.bind(this));
    }
    return this.socket;
  }

  private onConnect() {
    const { host, port } = this;
    console.log(`Connected to keyval://${host}:${port}`);
  }


  private constructOptions(opts: net.TcpNetConnectOpts | URL | string): [string, number] {
    if (typeof opts === 'string') {
      opts = new URL(opts);
    }
    if (opts instanceof URL) {
      return [opts.hostname, parseInt(opts.port)];
    }
    return [opts?.host || 'localhost', opts?.port || 9090];
  }
}
