import http2 from 'http2';

const server = http2.createServer();

server.on('error', err => {
  console.error(err);
});

server.on('stream', (stream, headers) => {

  const path = headers[':path'];
  const method = headers[':method'];

  console.log(`[${method}] - ${path}`);

  stream.respond({
    ':status': 200,
  });

  stream.end();
});


server.listen(3000)