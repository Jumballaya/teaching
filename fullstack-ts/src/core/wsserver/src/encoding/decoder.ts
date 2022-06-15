import { getBitsOf } from "./bits";

export const decodeMessage = (msg: Buffer) => {
  const out = {
    fin: 0,
    length: 0,
    payload: '',
  };
  let cursor = 2;
  const [sec1, sec2] = getBitsOf(msg, 0, cursor);
  const [fin, ..._] = sec1;
  out.fin = fin;

  const [hasMask, ...lenBitsStart] = sec2;
  const length = parseInt(lenBitsStart.join(''), 2)
  out.length = length;

  if (length === 126) {
    cursor += 2;
    const [top, bottom] = getBitsOf(msg, 2, cursor);
    const length = parseInt(top.join('') + bottom.join(''), 2);
    out.length = length;
  } else if (length === 127) {
    cursor += 8;
    const bytes = getBitsOf(msg, 2, cursor);
    const length = parseInt(bytes.map(b => b.join('')).join(''), 2);
    out.length = length;
  }


  if (hasMask === 1) {
    const maskBytes = msg.slice(cursor, cursor + 4);
    cursor += 4;
    const encoded = msg.slice(cursor, cursor + out.length);
    let payload = '';
    for (let i = 0; i < encoded.byteLength; i++) {
      const encAt = encoded.at(i);
      const maskByteAt = maskBytes.at(i % 4);
      if (typeof encAt === 'number' && typeof maskByteAt === 'number') {
        payload += String.fromCharCode(encAt ^ maskByteAt);
      }
    }
    out.payload = payload;
  }

  return out;
}