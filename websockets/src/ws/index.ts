import { KeyValueClient } from '../keyval/src/client/KeyValueClient';
import { PubSubClient } from '../pubsub/src/client/PubSubClient';
import { WSDataEvent } from './src/interfaces/ws-data-event.interface';
import { WSEvent } from './src/interfaces/ws-event.interface';
import { WSServer } from './src/WSServer';

const { env } = process;
const port = env.PORT ? parseInt(env.PORT) : 3000;
const server = new WSServer(port, env.HOST || 'localhost');


const main = async () => {
  const psClient = new PubSubClient('pubsub://pubsub:4567');
  const kvClient = new KeyValueClient('keyval://keyvalue:9090');

  const chat = await kvClient.createCollection('chat');
  await chat.create('main:chat', '');

  const addToMainChat = async (line: string) => {
    const txt = await chat.read('main:chat');
    let full = (txt.payload?.value || '') + line + '\n';
    const split = full.split('\n');
    if (split.length > 50) {
      full = split.slice(split.length - 50).join('\n');
    }
    await chat.update('main:chat', line + '\n');
  }

  psClient.subscribe('chat:main', async (topic, data) => {
    if (topic === 'chat:main' && data.length > 0) {
      const list = server.getClientList();
      await addToMainChat(typeof data === 'object' ? JSON.stringify(data) : data);
      const full = await chat.read('main:chat');
      server.sendAll(JSON.stringify({ command: 'chat', payload: full.payload?.value || '', users: list }));
    }
  })

  server.start(() => {
    console.log('WebSocket Server Listening on Port 3000');
  });

  server.on('connected', async (evt: WSEvent) => {
    if (evt.id) {
      const line = `\n${evt.id} Connected\n`;
      const list = server.getClientList();
      await addToMainChat(line);
      const full = await chat.read('main:chat');
      const res = JSON.stringify({ command: 'chat', payload: full.payload?.value || line, users: list });
      server.sendAll(res);
    }
  });

  server.on('data', async (evt: WSDataEvent) => {
    const { id, data } = evt;
    try {
      const payload = JSON.parse(data.payload);
      if (payload.ping) {
        const res = { pong: true, };
        server.send(id, JSON.stringify(res));
      }
      if (payload.command === 'chat') {
        const line = `${id}: ${payload.payload}`;
        const list = server.getClientList();
        await addToMainChat(line);
        const full = await chat.read('main:chat');
        const res = JSON.stringify({ command: 'chat', payload: full.payload?.value || line, users: list });
        server.sendAll(res);
      }
    } catch (_) {
      if (data.payload.startsWith('\x03')) {
        data.payload = data.payload.split('').slice(2).join('');
      }
    }
  });

  server.on('close', async (evt: WSEvent) => {
    if (evt.id) {
      const list = server.getClientList();
      if (list.includes(evt.id)) {
        const line = `\n${evt.id} signed off\n`;
        await addToMainChat(line);
        const full = await chat.read('main:chat');
        const res = JSON.stringify({ command: 'chat', payload: full.payload?.value || line, users: list.filter(u => u !== evt.id) });
        server.sendAll(res);
      }
    }
    if (evt.socket.writable) {
      evt.socket.end();
    }
  })

}

main();