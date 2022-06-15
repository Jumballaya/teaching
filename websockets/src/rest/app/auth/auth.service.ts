import { BongoDBClient } from "../../../database/src/client/BongoDBClient";
import { RouteHandler } from "../../src/interfaces/route-handler.interface";
import { User } from "../interfaces/user.interface";
import { hashTools } from "./hash";
import { jwt } from "./jwt";


export const verifyToken: RouteHandler = (req, res, next?) => {
  const headers = req.headers;
  if (headers.authorization) {
    if (headers.authorization.startsWith('Bearer ')) {
      const token = headers.authorization.split('Bearer ')[1];
      const verified = jwt.verifyToken(token);
      console.log(jwt.decode(token));
      if (verified) {
        if (next) next();
        return;
      }
    }
  }
  res.setStatus(401);
  res.send({
    success: false,
  });
}

export const createAuthService = async (
  dbClient: BongoDBClient,
) => {
  const userCol = await dbClient.getCollection<User>('users', 'User');

  const login = async (username: string, password: string) => {
    const found = await userCol.read<User>({ username });
    const user = found.payload?.[0];
    if (user) {
      const verified = await hashTools.verify(password, user.password, user.salt);
      if (verified) {
        const token = jwt.encode({ username: user.username });
        const refresh_token = '';
        return { success: true, token, refresh_token };
      }
    }
    return { success: false, token: '', refresh_token: '' };
  };


  return {
    login,
  };

}