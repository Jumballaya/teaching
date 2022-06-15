import { BongoDBServer } from "./src/server/BongoDBServer";

const { env } = process;
const port = env.PORT ? parseInt(env.PORT) : 3000;
const server = new BongoDBServer(port, env.HOST || 'localhost');

server.start()