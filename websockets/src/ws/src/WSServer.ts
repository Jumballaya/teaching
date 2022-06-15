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
  ) {
    this.server = net.createServer(this.listener.bind(this));
  }

  public start(cb?: () => void) {
    this.server.listen(this.port, this.hostname, undefined, cb ? cb : this.startup);
  }

  public getClientList(): string[] {
    return Array.from(this.clients.keys());
  }

  public sendAll(message: string, except: string[] = [], masked = false) {
    for (const [id, socket] of this.clients) {
      if (except.includes(id)) continue;
      const buffer = encodeMessage(message, masked);
      socket.write(buffer);
    }
  }

  public send(clientName: string, message: string, masked = false) {
    if (this.clients.has(clientName)) {
      const client = this.clients.get(clientName);
      const buffer = encodeMessage(message, masked);
      client?.write(buffer);
    }
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
    // If we have the client listed, then close the socket if
    // it isn't already closed and remove the client from the
    // clients map
    if (this.clients.has(id)) {
      const socket = this.clients.get(id);
      if (socket?.writable) socket?.end();
      this.clients.delete(id);
    }
  }

  private listener(socket: net.Socket) {
    // 1. Use the unique ID to manage client lifecycle
    let id = '';

    // 2. Setup 'on close' to remove client from the clients map and close the socket
    socket.on('close', () => {
      if (this.callbacks.close) this.callbacks.close({ id, socket });
      this.close(id);
    });

    // 3. Setup 'on data' to either process a handshake and register a new client
    //    or decode a message and pass it along
    socket.on('data', data => {
      try {
        // 3a. Attempt handshake parsing
        const [success, parsed] = this.handshakeProcess(data, socket);
        if (success) {
          // 3b. On success - register the client id and update the connected listener
          id = parsed.key;
          if (this.callbacks.connected) {
            this.callbacks.connected({ id, socket });
          }
        }
      } catch (_) {
        // 3c. If incoming data is not an HTTP message try to decode it as a websocket message
        //     and then pass it along
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

  private startup() {
    console.log(`WebSocket server starting on port: ${this.port}`);
  }

}