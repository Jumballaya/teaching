import net from 'net';
import { Store } from '../core/Store';
import { Command } from '../interfaces/command.interface';
import { commandParser } from './command-parser';

export class KeyValueServer {

  private server: net.Server;
  private store: Store = new Store();

  constructor(
    private port = 3000,
    private hostname = 'localhost',
  ) {
    this.server = net.createServer(this.listener.bind(this));
  }

  public start(cb?: () => void) {
    this.server.listen(this.port, this.hostname, undefined, cb ? cb : this.startup);
  }

  private listener(socket: net.Socket) {
    socket.on('data', data => {
      try {
        const command: Command = JSON.parse(data.toString());
        const parsed = commandParser(command);
        if (parsed.startsWith('collection')) {
          this.handleCollectionCommand(command, socket, parsed);
        }
        if (parsed.startsWith('entry')) {
          this.handleEntryCommand(command, socket, parsed);
        }
        if (command === 'error') {
          throw new Error(`Could not issue command: ${data}`);
        }
      } catch (e) {
        if (e instanceof Error) {
          socket.write(JSON.stringify({ success: false, message: e.message }));
          socket.end();
        }
      }
    });
  }

  private handleCollectionCommand(command: Command, socket: net.Socket, parsed: string) {
    switch (parsed) {
      case 'collection:create': {
        const cmd = command.collection?.create;
        if (cmd) {
          this.store.createCollection(cmd.name);
          socket.write(JSON.stringify({ success: true }));
        }
        break;
      }

      case 'collection:read': {
        const cmd = command.collection?.read;
        if (cmd) {
          const collection = this.store.readCollection(cmd.name);
          if (collection) {
            socket.write(JSON.stringify({ success: true }));
            return;
          }
          socket.write(JSON.stringify({
            success: false,
            message: `Collection ${cmd.name} does not exist`,
          }));
        }
        break;
      }
    }
  }

  private handleEntryCommand(command: Command, socket: net.Socket, parsed: string) {
    switch (parsed) {
      case 'entry:create': {
        const cmd = command.entry?.create;
        if (cmd) {
          const { collection, payload } = cmd;
          const col = this.store.readCollection(collection);
          if (!col) {
            throw new Error(`Unable to find collection ${collection}`);
          }
          if (!col.has(payload.key)) {
            col.create(payload.key, payload.value);
          }
          socket.write(JSON.stringify({ success: true }));
        }
        break;
      }

      case 'entry:read': {
        const cmd = command.entry?.read;
        if (cmd) {
          const { collection, key } = cmd;
          const col = this.store.readCollection(collection);
          if (!col) {
            throw new Error(`Unable to find collection ${collection}`);
          }
          const value = col.read(key);
          if (value === undefined) {
            col.create(key, '');
          }
          const payload = { key, value: col.read(key) };
          socket.write(JSON.stringify({ success: true, payload }));
        }
        break;
      }

      case 'entry:update': {
        const cmd = command.entry?.update;
        if (cmd) {
          const { collection, key, updates } = cmd;
          const col = this.store.readCollection(collection);
          if (!col) {
            throw new Error(`Unable to find collection ${collection}`);
          }
          const updated = col.update(key, updates);
          const payload = { key, value: updated };
          socket.write(JSON.stringify({ success: true, payload }));
        }
        break;
      }

      case 'entry:delete': {
        const cmd = command.entry?.delete;
        if (cmd) {
          const { collection, key } = cmd;
          const col = this.store.readCollection(collection);
          if (!col) {
            throw new Error(`Unable to find collection ${collection}`);
          }
          const payload = { key, value: col.delete(key) };
          socket.write(JSON.stringify({ success: true, payload }));
        }
        break;
      }
    }
  }


  private startup() {
    console.log(`WebSocket server starting on port: ${this.port}`);
  }

}