import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist/assets', { recursive: true });
await mkdir('dist/server', { recursive: true });
await Promise.all([
  cp('index.html', 'dist/index.html'),
  cp('styles.css', 'dist/styles.css'),
  cp('script.js', 'dist/script.js'),
  cp('assets', 'dist/assets', { recursive: true }),
  cp('.openai', 'dist/.openai', { recursive: true })
]);

// Sites expects a Cloudflare Worker entrypoint. The authored website remains
// plain HTML/CSS/JS; this generated file only serves those static assets.
const staticFiles = {
  '/': ['text/html; charset=utf-8', await readFile('index.html', 'utf8')],
  '/index.html': ['text/html; charset=utf-8', await readFile('index.html', 'utf8')],
  '/styles.css': ['text/css; charset=utf-8', await readFile('styles.css', 'utf8')],
  '/script.js': ['text/javascript; charset=utf-8', await readFile('script.js', 'utf8')]
};
const worker = `const files = ${JSON.stringify(staticFiles)};\nexport default { async fetch(request) { const path = new URL(request.url).pathname; const file = files[path] || files['/']; return new Response(file[1], { headers: { 'content-type': file[0], 'cache-control': path === '/' ? 'no-cache' : 'public, max-age=3600' } }); } };\n`;
await writeFile('dist/server/index.js', worker);
console.log('Built static site in dist/');
