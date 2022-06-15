import { BongoDBClient } from "../../../database/src/client/BongoDBClient";
import { Router } from "../../src/Router"
import { createAuthService, verifyToken } from "./auth.service";
import { jwt } from "./jwt";


export const createAuthRouter = async (
  dbClient: BongoDBClient,
) => {
  const router = new Router();
  const authService = await createAuthService(dbClient);

  router.post('/login', async (req, res) => {
    // Hash password and check it against the database
    // If it is true, create an auth token and a refresh token and send it back
    const body = req.body;
    if (body.username && body.password) {
      const response = await authService.login(body.username, body.password);
      res.json(response);
      return;
    }
    res.json({
      success: false,
      message: 'Incorrect login details'
    })
  });

  router.get('/refresh', verifyToken, async (req, res) => {
    // Use a refresh token to get another auth token and refresh token
    console.log('Refresh route');
    res.send({
      path: '/auth/refresh'
    });
  });

  router.get('/check', verifyToken, async (req, res) => {
    res.json({
      success: true,
    });
  });

  return router;
}