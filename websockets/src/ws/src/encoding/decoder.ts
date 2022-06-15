import { getBitsOf } from "./bits";
import { DecodeState } from "./interfaces/decode-state.interface";



export const decodeMessage = (msg: Buffer): DecodeState['data'] => {
  const state: DecodeState = {
    cursor: 2,
    data: {
      fin: 0,
      length: 0,
      payload: '',
    }
  };

  // 1. Get the bits from the first 2 bytes of the message
  const [sec1, sec2] = getBitsOf(msg, 0, state.cursor);

  // 2. The first bit from the first byte tells us if the message is complete (finished)
  const [fin, res1, res2, res3, ..._] = sec1;
  state.data.fin = fin;

  // 3. Bits 2, 3 and 4 are reserved and must be 0
  if (res1 !== 0 || res2 !== 0 || res3 !== 0) {
    throw new Error(`Malformed payload: rsv1, rsv2, rsv3 bits are reserved`);
  }

  // 4. First bit of byte 2 is the mask flag to see if the payload is masked
  // 5. The rest of the byte is the length of the payload
  const [hasMask, ...lenBitsStart] = sec2;
  const length = parseInt(lenBitsStart.join(''), 2)
  state.data.length = length;

  // 6. If the length is > 125 (126 or 127) then proceed to the special cases below
  if (length === 126) {

    // 6a. If the length is 126, read the next 2 bytes, and that is the real payload length
    state.cursor += 2;
    const [top, bottom] = getBitsOf(msg, 2, state.cursor);
    const length = parseInt(top.join('') + bottom.join(''), 2);
    state.data.length = length;
  } else if (length === 127) {

    // 6b. If the length is 127, read the next 8 bytes and that is the real payload length
    state.cursor += 8;
    const bytes = getBitsOf(msg, 2, state.cursor);
    const length = parseInt(bytes.map(b => b.join('')).join(''), 2);
    state.data.length = length;
  }

  // 7. If the mask bit is 1, get the mask and decode the payload
  if (hasMask === 1) {

    // 7a. Mask is 4 bytes long and the next 4 bytes of the message
    const maskBytes = msg.slice(state.cursor, state.cursor + 4);
    state.cursor += 4;

    // 7b. The encoded payload is everything after the mask bytes
    const encoded = msg.slice(state.cursor, state.cursor + state.data.length);
    let payload = '';
    for (let i = 0; i < encoded.byteLength; i++) {
      const encAt = encoded.at(i);
      const maskByteAt = maskBytes.at(i % 4);
      if (typeof encAt === 'number' && typeof maskByteAt === 'number') {

        // 7c. XOR the payload bytes with the mask bytes to decode the message
        payload += String.fromCharCode(encAt ^ maskByteAt);
      }
    }
    state.data.payload = payload;
  }

  return state.data;
}