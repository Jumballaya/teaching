import crypto from 'crypto';
import { HandshakeRequest } from './interfaces/handshake-request.interface';
import { HTTPPayload } from './interfaces/http-payload.interface';
import { HTTPStatus } from './interfaces/http-status.interface';

export const hashValue = (val: string): string => {
  const MAGIC_STRING = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
  return crypto.createHash('sha1').update(val + MAGIC_STRING).digest('base64');
}

export const parseHTTPStatus = (statusLine: string): HTTPStatus => {
  const ret = {
    method: '',
    path: '',
    protocol: {
      name: '',
      version: 0.0,
    },
  };
  const items = statusLine.split(' ').map(s => s.trim()).map(s => s.toLowerCase());
  ret.method = items[0];
  ret.path = items[1];
  const protocol = items[2];

  const protocolName = protocol.split('/')[0];
  ret.protocol.name = protocolName;
  if (protocolName === 'http') {
    const versionString = protocol.split('/')[1];
    if (versionString) {
      ret.protocol.version = parseFloat(versionString);
    }
  }

  return ret;
}

export const parseHTTPPayload = (req: string): HTTPPayload => {
  const [statusLine, ...headerLines] = req.split('\r\n');
  const status = parseHTTPStatus(statusLine);
  const headers = new Map<string, string | number>();

  let line = headerLines.shift()?.trim();
  while (line && line !== '\r\n') {
    const [key, ...vals] = line.split(':').map(s => s.trim());
    const value = vals.join(':');
    if (!isNaN(parseFloat(value))) {
      headers.set(key, parseFloat(value));
    } else {
      headers.set(key, value);
    }
    line = headerLines.shift()?.trim();
  }

  const body = headerLines.join('\r\n');

  return { status, headers, body };
}

export const parseHandshake = (reqString: string): [boolean, HandshakeRequest] => {
  const req = parseHTTPPayload(reqString);

  const out = {
    key: '',
    version: 0,
    origin: '',
  }

  let completeHandshake = false;
  for (const [key, value] of req.headers) {
    if (typeof value !== 'string') continue;
    if (key.toLowerCase() === 'upgrade') {
      completeHandshake = value.toLowerCase() === 'websocket';
    }
    if (key.toLowerCase() === 'sec-websocket-key') {
      out.key = hashValue(value);
    }
    if (key.toLowerCase() === 'sec-websocket-version') {
      out.version = parseInt(value);
    }
    if (key.toLowerCase() === 'origin') {
      out.origin = value;
    }
  }

  const isGet = req.status.method.toLowerCase() === 'get';
  const isHttp = req.status.protocol.name.toLowerCase() === 'http';
  const correctVersion = req.status.protocol.version > 1.0;
  const statusIsVerified = isGet && isHttp && correctVersion;
  completeHandshake = completeHandshake && statusIsVerified;
  return [completeHandshake, { ...out, req }];
}