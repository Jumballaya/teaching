import { Token } from "./interfaces/token.interfaces";
import { TokenType } from "./types/token-type.type";

const regex = {
  letters: /^[A-Za-z]*/,
  digits: /^[0-9]*/,
  operators: /^(\+|-|\*|\/|\(|\))$/,
}

const isLetter = (l: string): boolean => {
  const match = l.match(regex.letters);
  return match !== null && match.length > 0 && match[0].length > 0;
}

const isNumber = (n: string): boolean => {
  const match = n.match(regex.digits);
  return match !== null && match.length > 0 && match[0].length > 0;
}

const isOperator = (o: string): boolean => {
  const match = o.match(regex.operators);
  return match !== null && match.length > 0 && match[0].length > 0;
}

const parseLetters = (s: string, i: number): [number, Token] => {
  let inc = 0;
  let l = s[i];
  while (l && isLetter(l)) {
    inc++;
    l = s[i + inc];
  }
  const value = s.slice(i, i + inc);
  const token = createToken(value, 'string');
  return [inc, token];
}

const parseNumber = (n: string, i: number): [number, Token] => {
  let inc = 0;
  let d = n[i];
  while (d && isNumber(d)) {
    inc++;
    d = n[i + inc];
  }
  const value = n.slice(i, i + inc);
  const token = createToken(value, 'number');
  return [inc, token];
}

const parseOperator = (o: string, i: number): [number, Token] => {
  let inc = 0;
  let op = o[i];
  while (op && isOperator(op)) {
    const nextCount = inc + 1;
    const aggregate = o.slice(i, i + nextCount);
    if (!isOperator(aggregate)) {
      break;
    }
    inc++;
    op = o[i + inc];
  }
  const value = o.slice(i, i + inc);
  const token = createToken(value, 'operator');
  return [inc, token];
}

const createToken = (value: string, type: TokenType): Token => ({ type, value })

export function* tokenize(input: string): Generator<Token, void, void> {
  let cursor = 0;

  while (cursor < input.length) {
    const curr = input[cursor];
    if (curr === ' ') {
      cursor++;
      continue;
    }
    if (curr.toLowerCase() === 't' || curr.toLowerCase() === 'f') {
      if (input.slice(cursor, cursor + 4).toLowerCase() === 'true') {
        yield createToken('true', 'boolean');
        cursor += 4
        continue;
      }
      if (input.slice(cursor, cursor + 5).toLowerCase() === 'false') {
        yield createToken('false', 'boolean');
        cursor += 5;
        continue;
      }
    }
    if (isLetter(curr)) {
      const [inc, token] = parseLetters(input, cursor);
      cursor += inc;
      yield token;
      continue;
    }
    if (isNumber(curr)) {
      const [inc, token] = parseNumber(input, cursor);
      cursor += inc;
      yield token;
      continue;
    }
    if (isOperator(curr)) {
      const [inc, token] = parseOperator(input, cursor);
      cursor += inc;
      yield token;
      continue;
    }
    cursor++;
    yield createToken(curr, 'error');
  }

  yield createToken('\0', 'eof');
}

