import crypto from 'crypto';
import { config } from '../config';

interface JWTPayload {
  iss?: string;
  exp?: number;
  sub?: string;
  aud?: string;
  nbf?: number;
  iat?: number;
  jti?: string;
}

interface JWT<T = never> {
  header: {
    alg: string;
    typ: string;
  };
  payload: T extends any ? T & JWTPayload : JWTPayload;
}

const createHeader = (alg = 'HS256', typ = 'JWT'): string => JSON.stringify({ alg, typ });

const createPayload = <T>(payload: JWT<T>['payload']): string => JSON.stringify({
  ...payload,
  exp: Date.now() + config.jwt.expiresIn,
  iat: Date.now(),
})

const createSignature = (header: string, payload: string): string => {
  if (!config.jwt.secret) {
    return '';
  }
  return crypto.createHmac('sha256', config.jwt.secret).update(`${header}.${payload}`).digest('base64url');
}

const verifyToken = (jwt: string): boolean => {
  // Split out the parts
  const [header, payload, signature] = jwt.split('.');

  // Check the signature
  const remadeSig = createSignature(header, payload);
  const sameSig = remadeSig === signature;
  if (!sameSig) return false;

  // Decode the JWT
  const decoded = decode(jwt);

  // Check EXP date
  const exp = decoded?.payload.exp ? decoded.payload.exp : Infinity;
  if (exp <= Date.now()) return false;

  // Check NBF date
  const nbf = decoded?.payload.nbf ? decoded.payload.nbf : -Infinity;
  if (nbf > Date.now()) return false;

  return true;
}

const encode = <T>(data: JWT<T>['payload']) => {
  const header = Buffer.from(createHeader()).toString('base64url');
  const payload = Buffer.from(createPayload(data)).toString('base64url');
  const signature = createSignature(header, payload);
  return `${header}.${payload}.${signature}`;
}

const decode = <T>(jwt: string): JWT<T> | null => {
  const [header, payload, _] = jwt.split('.');

  const headerString = Buffer.from(header, 'base64url').toString('ascii');
  const payloadString = Buffer.from(payload, 'base64url').toString('ascii');

  return {
    header: JSON.parse(headerString.toString()),
    payload: JSON.parse(payloadString.toString()),
  }
}



export const jwt = { encode, decode, verifyToken };