import { TokenType } from "../types/token-type.type";

export interface Token {
  type: TokenType;
  value: string;
}