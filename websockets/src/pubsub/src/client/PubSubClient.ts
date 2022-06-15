import crypto from 'crypto';
import net from 'net';
import { PubSubResponse } from '../interfaces/pubsub-response.interface';

export class PubSubClient {

  private socket: net.Socket | null = null;
  private host: string;
  private port: number;
  private clientId: string = crypto.randomUUID();

  private callbacks: Map<string, (topic: string, data: string) => void> = new Map();

  constructor(opts: net.TcpNetConnectOpts | URL | string) {
    const [host, port] = this.constructOptions(opts);
    this.host = host;
    this.port = port;
    this.socket = this.connect();
    this.setupListener();
  }

  public close() {
    if (this.socket) {
      if (this.socket.writable) {
        this.socket.end();
      }
      this.socket = null;
    }
  }

  public subscribe(topic: string, cb: (topic: string, data: string) => void) {
    const listener = (topic: string, data: string) => {
      try {
        cb(topic, data || '')
      } catch (e) {
        if (e instanceof Error) {
          cb(topic, e.message);
        }
      }
    }

    this.callbacks.set(topic, listener);
    const id = this.clientId;
    const cmd = JSON.stringify({ subscribe: { topic, id } });
    this.send(cmd);
  }

  public async unsubscribe(topic: string) {
    const id = this.clientId;
    const cmd = JSON.stringify({ unsubscribe: { topic, id } });
    this.send(cmd);
  }

  public async publish(topic: string, data: string) {
    const cmd = JSON.stringify({
      publish: { topic, data }
    });
    this.send(cmd);
  }

  private setupListener() {
    this.socket?.on('data', (data) => {
      try {
        const res: PubSubResponse = JSON.parse(data.toString());
        const topic = res.topic;
        const cb = this.callbacks.get(topic);
        if (cb) {
          cb(topic, res.payload || res.message || '');
        }
      } catch (e) {
        console.log('Errored out');
      }
    })
  }

  private send(data: string) {
    if (this.socket?.writable) {
      this.socket.write(data);
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
    console.log(`Connected to pubsub://${host}:${port}`);
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
