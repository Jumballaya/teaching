import { getBits } from "./bits";

export const encodeMessage = (msg: string): Buffer => {
  const msgBuffer = Buffer.from(msg);
  const size = msgBuffer.byteLength;

  // Fin -> 0x1, RSV1/2/3 -> 0x0, OpCODE -> 0x0001
  const firstByte = 0b10000001;
  let buf = Buffer.from([firstByte]);

  if (size <= 125) {
    buf = Buffer.concat([buf, Buffer.from([size])]);
  } else if (size < 2 ** 16) {
    const bits = getBits(size, 16);
    const first = parseInt(bits.slice(0, 8).join(''), 2);
    const second = parseInt(bits.slice(8).join(''), 2);
    const b = [126, first, second];
    buf = Buffer.concat([buf, Buffer.from(b)]);
  } else {
    const bits = getBits(size, 64);
    const bytes = [
      parseInt(bits.slice(0, 8).join(''), 2),
      parseInt(bits.slice(8, 16).join(''), 2),
      parseInt(bits.slice(16, 24).join(''), 2),
      parseInt(bits.slice(24, 32).join(''), 2),
      parseInt(bits.slice(32, 40).join(''), 2),
      parseInt(bits.slice(40, 48).join(''), 2),
      parseInt(bits.slice(48, 56).join(''), 2),
      parseInt(bits.slice(56, 64).join(''), 2),
    ]
    const b = [126, ...bytes];
    buf = Buffer.concat([buf, Buffer.from(b)]);
  }

  buf = Buffer.concat([buf, msgBuffer]);

  return buf;
}