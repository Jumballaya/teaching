import { ASTNode } from "./interfaces/ast-node.interface";
import { Token } from "./interfaces/token.interfaces";
import { tokenize } from "./tokenizer";

const createNode = (token: Token, iterator: Generator<Token, void, void>): ASTNode => {
  let inParens = false;
  if (token.value === '(') {
    inParens = true;
    const next = iterator.next();
    if (next.done) {
      throw new Error('Unexpected end of input');
    }
    token = next.value;
  }
  const node: ASTNode = {
    value: token.value,
    type: token.type,
  }

  if (node.type === 'operator') {
    const tk = iterator.next().value;
    if (tk) {
      node.left = createNode(tk, iterator);
    }
  }

  if (node.type === 'operator') {
    const tk = iterator.next().value;
    if (tk) {
      node.right = createNode(tk, iterator);
    }
  }

  if (inParens) {
    const tk = iterator.next().value;
    if (tk) {
      if (tk.value !== ')') {
        throw new Error('Expected \')\'');
      }
    } else {
      throw new Error('Expected \')\'');
    }
  }

  return node;
}


export const parser = (input: string): ASTNode[] => {
  const nodes: ASTNode[] = [];
  const tokenIterator = tokenize(input);
  for (let token of tokenIterator) {
    if (token.type === 'error') {
      throw new Error(`Unkown input: ${token.value}`);
    }
    const node = createNode(token, tokenIterator);
    nodes.push(node);
  }
  return nodes;
}


