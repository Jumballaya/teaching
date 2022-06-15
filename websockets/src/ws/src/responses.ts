export const basicResponses = {

  // Correct Handshake Response
  handshake: (key: string): string => [
    'HTTP/1.1 101 Switching Protocols\r\n',
    'Upgrade: websocket\r\n',
    'Connection: Upgrade\r\n',
    `Sec-WebSocket-Accept: ${key}\r\n`,
    '\r\n',
  ].join(''),

  // 400 BAD REQUEST
  badRequest: () => [
    "HTTP/1.1 400 Bad Request\r\n",
    "Content-Type: text/plain\r\n",
    "Connection: close\r\n",
    "\r\n",
    "Incorrect request",
  ].join(''),


}