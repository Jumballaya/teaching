import { Socket } from 'net';

export interface WSEvent {
  id: string;
  socket: Socket;
}