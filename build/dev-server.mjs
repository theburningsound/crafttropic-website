import { createReadStream, existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const root = process.cwd();
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml' };
const server = createServer((request, response) => {
  const cleanPath = normalize(decodeURIComponent(request.url.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  let filePath = join(root, cleanPath === '/' ? 'index.html' : cleanPath);
  if (!existsSync(filePath)) filePath = join(root, 'index.html');
  response.setHeader('Content-Type', types[extname(filePath)] || 'application/octet-stream');
  createReadStream(filePath).pipe(response);
});

server.listen(4173, '127.0.0.1', () => console.log('Local: http://127.0.0.1:4173/'));
