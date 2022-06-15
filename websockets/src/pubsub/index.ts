import { PubSubServer } from "./src/server/PubSubServer";

const { env } = process;
const port = env.PORT ? parseInt(env.PORT) : 3000;
const server = new PubSubServer(port, env.HOST || 'localhost');

server.start(() => {
  console.log(`Starting PubSub server on port ${port}`);
});