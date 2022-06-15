import { ASTNode } from "./interfaces/ast-node.interface";

export const calculate = (node: ASTNode | null): number => {
  if (node === null) {
    return 0;
  }
  if (node.type === 'eof') {
    return 0;
  }
  const left = node.left;
  let leftValue = 0;
  if (!left) {
    throw new Error(`No left-hand-side value for operator ${node.value}`);
  }
  if (left.type === 'operator') {
    leftValue = calculate(left);
  }
  if (left.type === 'number') {
    leftValue = parseFloat(left.value);
  }
  const right = node.right;
  let rightValue = 0;
  if (!right) {
    throw new Error(`No right-hand-side value for operator ${node.value}`);
  }
  if (right.type === 'operator') {
    rightValue = calculate(right);
  }
  if (right.type === 'number') {
    rightValue = parseFloat(right.value);
  }

  if (node.type === 'operator') {
    switch (node.value) {
      case '+': {
        return leftValue + rightValue;
      }

      case '-': {
        return leftValue - rightValue;
      }

      case '*': {
        return leftValue * rightValue;
      }

      case '/': {
        return leftValue / rightValue;
      }

      default: {
        throw new Error(`Unknown operator: ${node.value}`);
      }
    }
  }
  return parseFloat(node.value);
}