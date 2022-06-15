import { BongoDBClient } from "../../../database/src/client/BongoDBClient";
import { hashTools } from "../auth/hash";
import { User } from "../interfaces/user.interface";

export const createUserService = async (dbClient: BongoDBClient) => {

  const userCol = await dbClient.getCollection<User>('users', 'User');

  const signup = async (username: string, password: string) => {
    const user = await userCol.read({ username: username });
    if (user.payload?.length && user.payload.length > 0) {
      return {
        success: false,
        message: 'Username already taken',
      };
    }
    const { salt, hashed } = await hashTools.hash(password);
    const newUser: User = {
      username: username,
      displayname: username,
      password: hashed,
      salt,
      preferences: {
        darkMode: false,
      }
    };
    const userRes = await userCol.create<User>(newUser);
    return userRes;
  }

  return {
    signup,
  };
}