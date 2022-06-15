import net from 'net';


class TCPServer {
  private server: net.Server;

  constructor() {
    this.server = net.createServer(this.netHandler.bind(this));
  }

  public listen(port: number, cb: () => void) {
    this.server.listen(port, 'localhost', undefined, cb);
  }

  private netHandler(socket: net.Socket) {
    socket.on('data', (data: Buffer) => {
      console.log(`Data: \n${data.toString()}`);
      socket.write('Hello World');
      socket.end();
    });


    socket.on('error', (err: Error) => {
      socket.end();
      throw err;
    });
  }

}

const createHeader = (status: number, headers: Record<string, string | number>): string => {
  const statusLine = `HTTP/1.1 ${status}`;
  const headerList = Object.keys(headers).reduce((acc: string, cur: string) => {
    return acc.concat(`${cur}: ${headers[cur]}\n`);
  }, '');
  return statusLine + '\n' + headerList + '\n';
}

const httpServer = (port: number) => {
  const htmlBody = '<html><body><h1>Hello World</h1></body></html>';
  const html404Body = '<html><body><h1>404 Not Found</h1></body></html>';

  const server = net.createServer((socket: net.Socket) => {

    socket.on('data', (data: Buffer) => {

      const route = data.toString()
        .split('\r\n')[0]
        .replace('GET', '')
        .replace(' HTTP/1.1', '');

      console.log(route);

      if (route.trim() !== '/') {
        const headers = createHeader(404, {});
        const response = headers + '\n' + html404Body;
        socket.write(response);
        socket.end();
        return;
      }
      const headers = createHeader(200, {});
      const response = headers + '\n' + htmlBody;
      socket.write(response);
      socket.end();
    });

    socket.on('error', (err: Error) => {
      socket.end();
      throw err;
    });
  });
  server.listen(port);
}

const server = new TCPServer()
server.listen(3000, () => {
  console.log('Now listening on port 3000');
});