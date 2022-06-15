import { TokenType } from "../types/token-type.type";

export interface ASTNode {
  value: string;
  type: TokenType;
  left?: ASTNode;
  right?: ASTNode;
}