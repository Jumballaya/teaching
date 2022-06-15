import net from 'net';
import { PubSub } from '../core/pubsub';
import { Command } from '../interfaces/command.interface';
import { commandParser } from './command-parser';

export class PubSubServer {

  private server: net.Server;
  private pubsub = new PubSub()

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
    socket.on('data', async data => {
      try {
        const command: Command = JSON.parse(data.toString());
        const parsed = commandParser(command);
        if (parsed.startsWith('publish')) {
          await this.handlePublishCommand(command, socket, parsed);
          return;
        }
        if (parsed.startsWith('subscribe')) {
          await this.handleSubscribeCommand(command, socket, parsed);
          return;
        }
        if (parsed.startsWith('unsubscribe')) {
          await this.handleUnSubscribeCommand(command, socket, parsed);
          return;
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

  private async handlePublishCommand(command: Command, socket: net.Socket, parsed: string) {
    const cmd = command.publish;
    if (cmd) {
      const { data, topic } = cmd;
      await this.pubsub.publish(topic, data)
      socket.write(JSON.stringify({
        success: true,
        topic,
      }));
      return;
    }
    socket.write(JSON.stringify({
      success: false,
      topic: command.publish?.topic,
      message: `Unable to parse unsubscribe message: ${JSON.stringify(command)}`
    }));
  }

  private async handleSubscribeCommand(command: Command, socket: net.Socket, parsed: string) {
    const cmd = command.subscribe;
    if (cmd) {
      const { topic, id } = cmd;
      const subscription = this.createSubscribption(socket);
      this.pubsub.subscribe(topic, id, subscription);
      socket.write(JSON.stringify({
        success: true,
        topic,
      }));
      return;
    }
    socket.write(JSON.stringify({
      success: false,
      topic: command.subscribe?.topic,
      message: `Unable to parse unsubscribe message: ${JSON.stringify(command)}`
    }));
  }

  private async handleUnSubscribeCommand(command: Command, socket: net.Socket, parsed: string) {
    const cmd = command.unsubscribe;
    if (cmd) {
      const { topic, id } = cmd;
      this.pubsub.unsubscribe(topic, id);
      socket.write(JSON.stringify({
        success: true,
        topic,
      }));
      return;
    }
    socket.write(JSON.stringify({
      topic: command.unsubscribe?.topic,
      success: false,
      message: `Unable to parse unsubscribe message: ${JSON.stringify(command)}`
    }));
  }


  private createSubscribption(socket: net.Socket) {
    return async (name: string, data: string) => {
      if (socket.writable) {
        socket.write(JSON.stringify({
          success: true,
          topic: name,
          payload: data
        }));
      }
    };
  }

  private startup() {
    console.log(`WebSocket server starting on port: ${this.port}`);
  }

}