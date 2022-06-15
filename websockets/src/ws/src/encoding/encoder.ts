import crypto from 'crypto';
import { getBits } from "./bits";

const encodeSizeAndMask = (size: number, mask: boolean): Buffer => {
  // Size < 125
  if (size <= 125) {

    // Set mask bit if needed and return the size byte
    const byte = mask ? 0b10000000 | size : size;
    return Buffer.from([byte]);

    // Size > 125 < 2 Bytes
  } else if (size < 2 ** 16) {
    const bits = getBits(size, 16);
    const first = parseInt(bits.slice(0, 8).join(''), 2);
    const second = parseInt(bits.slice(8).join(''), 2);

    // Set mask bit on size byte if needed and return the size for a total of 3 bytes
    const len = mask ? 0b10000000 | 126 : 126;
    return Buffer.from([len, first, second]);
  }

  // Size > 2 Bytes < 8 Bytes
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

  // Set mask bit on size byte if needed and return the size for a total of 9 bytes
  const len = mask ? 0b10000000 | 127 : 127;
  return Buffer.from([len, ...bytes]);
}

const encodePayload = (msgBuffer: Buffer, mask: boolean): Buffer => {
  const size = msgBuffer.byteLength;
  if (mask) {
    // 1. Create random mask bytes (4)
    const maskBytes = crypto.randomBytes(4);
    const maskedData: number[] = [];
    for (let i = 0; i < size; i++) {
      const msgByte = msgBuffer.at(i);
      const maskByte = maskBytes.at(i);
      if (typeof msgByte === 'number' && typeof maskByte === 'number') {
        // 2. Mask payload 
        maskedData.push(msgByte ^ maskByte);
      }
    }
    return Buffer.from(maskedData);
  }
  return msgBuffer;
}

export const encodeMessage = (msg: string, mask = false): Buffer => {
  // 1. Convert message to a Buffer
  const msgBuffer = Buffer.from(msg);
  const size = msgBuffer.byteLength;

  // 2. First Byte -- Fin -> 0x1, RSV1/2/3 -> 0x0, OpCODE -> 0x0001
  const firstByte = Buffer.from([0b10000001]);

  // 3. Payload size and mask bit
  const sizeAndMask = encodeSizeAndMask(size, mask);

  // Payload bytes (masked or unmasked)
  const payload = encodePayload(msgBuffer, mask);

  // Otherwise append payload
  return Buffer.concat([firstByte, sizeAndMask, payload])
}