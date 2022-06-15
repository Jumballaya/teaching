import { KeyValueClient } from "../../../keyval/src/client/KeyValueClient";
import { PubSubClient } from "../../../pubsub/src/client/PubSubClient";
import { Router } from "../../src/Router";


const router = new Router();


export const createChatRouter = async (
  kvClient: KeyValueClient,
  psClient: PubSubClient,
) => {
  const chatCol = await kvClient.getCollection('chat');

  router.get('/', async (req, res) => {
    // Get all chats rooms (BASED ON TOKEN)

    res.json({
      path: '/chat',
    })
  });

  router.get('/:id', async (req, res) => {
    // Get info for a single room (BASED ON TOKEN)

    res.json({
      path: '/chat/:id',
    })
  });

  router.get('/:id/join', async (req, res) => {
    // Join a room (BASED ON TOKEN and if room is private/public)

    res.json({
      path: '/chat/:id/join',
    })
  });

  router.delete('/:id/leave', async (req, res) => {
    // Leave a room (BASED ON TOKEN)

    res.json({
      path: 'delete /chat/:id/leave',
    })
  });

  router.post('/', async (req, res) => {
    // Create a new room

    res.json({
      path: 'post /',
    })
  });

  router.delete('/:id', async (req, res) => {
    // Delete a room (BASED ON TOKEN)

    res.json({
      path: 'delete /:id',
    })
  });


  //
  // ADMIN
  //

  router.get('/admin/message', async (req, res) => {
    const query = req.query;
    if (query.text) {
      await psClient.publish('chat:main', `- SERVER ADMIN: ${query.text} -`);
    }
    res.json({ response: 'ok', text: query.text });
  });

  router.get('/admin/logs', async (req, res) => {
    const kvRes = await chatCol.read('main:chat');
    res.json({ response: 'ok', res: kvRes });
  });

  return router;

}
