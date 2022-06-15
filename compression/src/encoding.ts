import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { Frequency } from './interfaces/frequency.interface';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);


type char = string;
const getFrequencyList = (s: string): Frequency[] => {
  const map: Record<char, number> = {};
  const out: Frequency[] = [];

  for (let c of s) {
    if (!(c in map)) {
      map[c] = 0;
    }
    map[c] += 1;
  }
  for (let c in map) {
    out.push({ char: c, weight: map[c] })
  }

  return out.sort((a, b) => {
    if (a.weight > b.weight) return 1;
    if (a.weight < b.weight) return -1;
    return 0;
  });
}

interface TNode {
  left?: TNode;
  right?: TNode;
  weight: number;
  char?: char;
}


const createNode = (c?: char, w = 0, left?: TNode, right?: TNode): TNode => {
  const char = c;
  let weight = w;
  if (left) {
    weight += left.weight;
  }
  if (right) {
    weight += right.weight;
  }
  return {
    left,
    right,
    weight,
    char,
  }
}

const createHuffmanTree = (nodes: TNode[]): TNode[] => {
  if (nodes.length >= 2) {
    const leftNode = nodes.shift();
    const rightNode = nodes.shift();
    if (leftNode && rightNode) {
      const newNode = createNode('', 0, leftNode, rightNode);
      nodes.push(newNode);
      nodes.sort((a, b) => {
        const aW = a.weight;
        const bW = b.weight;
        if (aW > bW) return 1;
        if (aW < bW) return -1;
        return 0;
      });
      return createHuffmanTree(nodes);
    }
  }
  return nodes;
}

const freqToNode = (f: Frequency): TNode => {
  const { char, weight } = f;
  return createNode(char, weight);
}

const isASCII = (str: string): boolean => {
  return /^[\x00-\x7F]*$/.test(str);
}

const buildEncodeMap = (root: TNode) => {
  const map: Record<string, string> = {};
  const _walkTree = (tree: TNode, code = '') => {
    if (tree.char) {
      map[tree.char] = code + '1';
    }
    if (tree.left) _walkTree(tree.left, code + '0');
    if (tree.right) _walkTree(tree.right, code + '1');
  }
  _walkTree(root);
  return map;
}


export const decode = (msg: string, tree: TNode): string => {
  let decoded = '';
  const _walkTree = (t: TNode, cur?: string, code?: string, message?: string) => {
    if (t.char) {
      decoded += t.char;
      _walkTree(tree, (message || '')[0], '', message?.slice(1));
    }
    if (cur === '0') {
      if (t.left) _walkTree(t.left, (message || '')[0], cur + code, message?.slice(1));
    }
    if (cur === '1') {
      if (t.right) _walkTree(t.right, (message || '')[0], cur + code, message?.slice(1));
    }
  }
  _walkTree(tree, msg[0], '0', msg.slice(1));

  return decoded;
}


const chunk = (str: string, size = 8): string[] => {
  const out: string[] = [];
  const count = Math.ceil(str.length / 8);
  for (let i = 0; i < count; i++) {
    const start = i * size;
    const piece = str.slice(start, start + size);
    out.push(piece);
  }
  return out;
}

export const encode = (message: string) => {
  message = message.split('').filter(isASCII).join('');
  const frequencies = getFrequencyList(message);
  const nodeList = frequencies.map(freqToNode);
  const tree = createHuffmanTree(nodeList)[0];
  const encodeMap = buildEncodeMap(tree);
  const encoded = message.split('').map(c => encodeMap[c] || '').join('');
  const buffer = Buffer.from(chunk(encoded).map(s => parseInt(s, 2)));
  return { encoded, tree, buffer, map: encodeMap };
}

const createTest = (tree: TNode) =>
  (expected: string, test: string) => {
    console.log(`${expected} -- ${test} -- ${decode(test, tree) === expected}`);
  }


export const dataBufferToString = (buf: Buffer): string => {
  let str = '';
  let iterator = buf.entries();
  let val = iterator.next();

  while (!val.done) {
    str += val.value[1].toString(2);
    val = iterator.next();
  }
  return str;
}

const treeFromMap = (map: Record<string, string>): TNode => {

  const frequencies = Object.keys(map)
    .map(x => ({ char: x, value: map[x] }))
    .sort((a, b) => {
      if (a.value.length < b.value.length) return 1;
      if (a.value.length > b.value.length) return -1;
      return 0;
    });

  const root: TNode = { weight: 0 };

  for (const freq of frequencies) {
    let r = root;
    freq.value.split('').forEach((bit, i) => {
      if (bit === '0') {
        if (!r.left) {
          r.left = { weight: 0 };
          if (i === freq.value.length - 1) {
            r.left.char = freq.char;
          }
        } else {
          r = root.left as TNode;
        }
      } else if (bit === '1') {
        if (!r.right) {
          r.right = { weight: 0 };
          if (i == freq.value.length - 1) {
            r.right.char = freq.char;
          }
        } else {
          r = root.right as TNode;
        }
      }
    })
  }

  return root;
}


const createHeader = (map: Record<string, string>) => {
  const h = Buffer.from(JSON.stringify(map), 'binary');
  const b = Buffer.from(h.byteLength + ':' + JSON.stringify(map), 'binary');
  return b;
}

export const encodeFile = async (path: string, ext = 'enc'): Promise<void> => {
  const fileBuffer = await readFile(path);
  const data = fileBuffer.toString();
  const { buffer, map } = encode(data);
  const header = createHeader(map);
  const full = Buffer.concat([header, buffer]);
  return await writeFile(`${path}.${ext}`, full);
}

export const decodeFile = async (path: string): Promise<string> => {
  const fileBuffer = await readFile(path);
  const headerSize = parseInt(fileBuffer.toString().split(':')[0]);
  const offset = Buffer.from(headerSize.toString() + ':');
  const offsetSize = offset.byteLength;
  const header = fileBuffer.subarray(offsetSize, headerSize + offsetSize);
  const body = fileBuffer.subarray(headerSize + offsetSize);
  const map = JSON.parse(header.toString());
  const tree = treeFromMap(map);
  // console.log(tree);
  const message = dataBufferToString(body);
  return decode(message, tree)
}

// const fpath = path.resolve(__dirname, '../', 'text.txt');

// encodeFile(fpath).then(() => {
//   decodeFile(fpath + '.enc').then(decoded => {
//     console.log(decoded);
//   }).catch(e => {
//     console.error(e);
//   });
// }).catch(e => {
//   console.error(e);
// });
