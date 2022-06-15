
import { BongoDBClient } from "../../../database/src/client/BongoDBClient";
import { Router } from "../../src/Router"
import { createUserService } from "./user.service";


export const createUserRouter = async (
  dbClient: BongoDBClient,
) => {
  const router = new Router();
  const userService = await createUserService(dbClient);

  router.post('/signup', async (req, res) => {
    // Create a new user
    const body = req.body;
    if (body.username && body.password) {
      const response = await userService.signup(body.username, body.password);
      if (response.success) {
        res.json({ ...response });
        return;
      }
      res.setStatus(400);
      res.json({
        success: false,
        message: response.message
      });
      return;
    }

    res.setStatus(401)
    res.json({
      success: false,
      message: 'Username and/or password are needed',
    });
  });

  router.get('/preferences/:id', (req, res) => {
    // Get preferences for a single user

    console.log('/preferences/:id')
    res.json({
      path: '/preferences/:id',
    })
  });

  router.post('/preferences/:id', (req, res) => {
    // Update a user's preferences
    console.log('post /preferences/:id')
    res.json({
      path: 'post /preferences/:id',
    })
  })

  return router;
}