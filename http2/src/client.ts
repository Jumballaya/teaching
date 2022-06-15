import http2 from 'http2';
import path from 'path';
import fs from 'fs';

const certPath = path.resolve(__dirname, '..', 'keys', 'cert.pem');

console.log(fs.readFileSync(certPath).toString());

const session = http2.connect('https://localhost:3000', {
  ca: fs.readFileSync(certPath).toString(),
});

session.on('error', err => {
  console.error(err);
});

const request = session.request({ ':path': '/some/path' });

request.end();

request.on('response', (headers) => {
  for (const header in headers) {
    console.log(`${header}: ${headers[header]}`);
  }
});

request.setEncoding('utf8');
let data = '';
request.on('data', chunk => data += chunk);


request.on('end', () => {
  console.log(`\n${data}\n`);
  session.close();
});