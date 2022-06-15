import { config } from "./config";
import { BongoDBClient } from "../../database/src/client/BongoDBClient";
import { KeyValueClient } from "../../keyval/src/client/KeyValueClient";
import { PubSubClient } from "../../pubsub/src/client/PubSubClient";
import { WebServer } from "../src/WebServer";
import { createAuthRouter } from "./auth/auth.router";
import { createChatRouter } from "./chat/chat.router";
import { createUserRouter } from "./user/user.router";

export const main = async () => {
  const app = new WebServer({ host: config.server.host });
  const dbClient = new BongoDBClient(config.database);
  const kvClient = new KeyValueClient(config.keyval);
  const psClient = new PubSubClient(config.pubsub);

  // Routers
  const chatRouter = await createChatRouter(kvClient, psClient);
  const authRouter = await createAuthRouter(dbClient);
  const userRouter = await createUserRouter(dbClient);

  app.use('/auth', authRouter);
  app.use('/user', userRouter);
  app.use('/chat', chatRouter);

  app.listen(config.server.port, () => {
    console.log(`HTTP Rest Server listening on port ${config.server.port}`);
  })
}