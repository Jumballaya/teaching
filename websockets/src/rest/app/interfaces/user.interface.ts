export interface User {
  username: string;
  displayname: string;

  password: string;
  salt: string;

  preferences: {
    darkMode: boolean;
  };
}