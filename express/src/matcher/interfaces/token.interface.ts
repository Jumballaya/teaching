import { TokenType } from "../types/token-types.type";

export interface Token {
  type: TokenType;
  value: string;
}