import net from 'net';
import { decodeMessage, encodeMessage } from './encoding';
import { HandshakeRequest } from './interfaces/handshake-request.interface';
import { WSDataEventCallback, WSEventCallback, WSServerCallbacks } from './interfaces/ws-server-callbacks.interface';
import { basicResponses } from './responses';
import { parseHandshake } from './util';


export class WSServer {

  private server: net.Server;
  private clients = new Map<string, net.Socket>();
  private callbacks: WSServerCallbacks = {
    data: null,
    close: null,
    connected: null,
  }

  constructor(
    private port = 3000,
    private hostname = 'localhost',
    private cb = () => { this.startup() },
  ) {
    this.server = net.createServer(this.listener.bind(this));
  }

  public start() {
    this.server.listen(this.port, this.hostname, undefined, this.cb)
  }

  public sendAll(message: string, except: string[] = []) {
    for (const [id, socket] of this.clients) {
      if (except.includes(id)) continue;
      const buffer = encodeMessage(message);
      socket.write(buffer);
    }
  }

  public send(clientName: string, message: string) {
    if (this.clients.has(clientName)) {
      const client = this.clients.get(clientName);
      const buffer = encodeMessage(message);
      client?.write(buffer);
    }
  }

  public getClientList(): string[] {
    return Array.from(this.clients.keys());
  }

  public on<K extends keyof WSServerCallbacks>(eventName: K, cb: WSServerCallbacks[K]) {
    if (eventName === 'data') {
      this.callbacks.data = cb as WSDataEventCallback;
    }
    if (eventName === 'close') {
      this.callbacks.close = cb as WSEventCallback;
    }
    if (eventName === 'connected') {
      this.callbacks.connected = cb as WSEventCallback;
    }
  }

  public close(id: string) {
    if (this.clients.has(id)) {
      const socket = this.clients.get(id);
      if (socket?.writable) socket?.end();
      this.clients.delete(id);
    }
  }

  private startup() {
    console.log(`WebSocket server starting on port: ${this.port}`);
  }

  private listener(socket: net.Socket) {
    let id = '';
    socket.on('close', () => {
      if (this.callbacks.close) this.callbacks.close({ id, socket });
      this.close(id);
    });
    socket.on('data', data => {
      try {
        const [success, parsed] = this.handshakeProcess(data, socket);
        if (success) {
          id = parsed.key;
          if (this.callbacks.connected) {
            this.callbacks.connected({ id, socket });
          }
        }
      } catch (_) {
        const decoded = decodeMessage(data);
        if (this.callbacks.data) {
          this.callbacks.data({ id, data: decoded, socket });
        }
      }
    });
  }

  private handshakeProcess(data: Buffer, socket: net.Socket): [boolean, HandshakeRequest] {
    // Make sure the correct HTTP payload was sent to initiatea websocket connection
    const [success, parsed] = parseHandshake(data.toString());
    if (!this.clients.has(parsed.key)) {
      if (success) {
        // Request was accepted, send back the correct HTTTP response
        const response = basicResponses.handshake(parsed.key);
        this.clients.set(parsed.key, socket);
        socket.write(response);
      } else {
        // Request was denied, something is wrong with the way the request was formed
        socket.write(basicResponses.badRequest());
        socket.end();
      }
    }
    return [success, parsed];
  }

}