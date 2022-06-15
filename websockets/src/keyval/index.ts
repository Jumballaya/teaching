import { KeyValueServer } from "./src/server/KeyValueServer";

const { env } = process;
const port = env.PORT ? parseInt(env.PORT) : 3000;
const server = new KeyValueServer(port, env.HOST || 'localhost');

server.start(() => {
  console.log(`Starting KeyValue server on port ${port}`);
});