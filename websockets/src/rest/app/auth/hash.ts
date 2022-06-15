import crypto from 'crypto';

const hash = (password: string): Promise<{ salt: string; hashed: string }> => {
  return new Promise((resolve, reject) => {
    // generate random 16 bytes long salt
    const salt = crypto.randomBytes(16).toString('base64')
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      const hashed = derivedKey.toString('base64');
      resolve({ salt, hashed });
    });
  })
}

const verify = (password: string, hash: string, salt: string): Promise<boolean> => {
  const hashBuf = Buffer.from(hash);
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      const derivedKeyBuf = Buffer.from(derivedKey.toString('base64'));
      const result = crypto.timingSafeEqual(hashBuf, derivedKeyBuf);
      resolve(result);
    });
  })
}

export const hashTools = { hash, verify }