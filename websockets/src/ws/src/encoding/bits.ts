type Bit = 1 | 0;

export const getBits = (byte: number, pad = 8): Bit[] =>
  byte
    .toString(2)
    .padStart(pad, '0')
    .split('')
    .map(x => parseInt(x) as Bit);

export const getBitsOf = (arr: Buffer, start: number, end?: number): Array<Bit[]> => {
  const ret = [];
  for (const byte of arr.slice(start, end)) {
    ret.push(getBits(byte));
  }
  return ret;
}
