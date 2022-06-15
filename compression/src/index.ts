import { dataBufferToString, encode } from "./encoding";
import { FileHeader } from "./Header";


const extractHeader = (buf: Buffer): Buffer => {
  const size = parseInt(buf.toString().split('\n')[0]);
  const header = Buffer.alloc(size);
  buf.copy(header, 0, 0, size);
  return header;
}


const headerBufferToMap = (buf: Buffer): Record<string, string> => {
  return buf
    .toString()
    .split('\n')
    .filter(line => line.includes(':'))
    .reduce((acc, cur) => {
      const [k, v] = cur.split(':');
      return {
        ...acc,
        [k]: v,
      }
    }, {} as Record<string, string>);
}

const valueInMap = (map: Record<string, string>, value: string): [boolean, string] => {
  const found: string | undefined = Object.keys(map).filter(k => map[k] === value)[0];
  if (found) {
    return [true, found];
  }
  return [false, '']
}





const message = 'hello there world';
const encodedData = encode(message);
const header = new FileHeader(encodedData.map);
const buf = header.getBuffer();
const full = Buffer.concat([buf, encodedData.buffer]);

console.log(full.toString(), '\n\n');


const hBuffer = extractHeader(full);
const map = headerBufferToMap(hBuffer);

const strBits = dataBufferToString(encodedData.buffer);
console.log(Array.from(encodedData.buffer).map(x => x.toString(2)), '\n\n');

let curWord = '';
let out = '';

for (const bit of strBits) {
  curWord += bit;
  const [inMap, value] = valueInMap(map, curWord);
  if (inMap) {
    out += value;
    curWord = '';
  }
}

console.log(out);