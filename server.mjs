import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const port = Number(process.env.DFS_SITE_PORT || process.env.PORT || 3000);
const publicDir = fileURLToPath(new URL('./dist/', import.meta.url));
const allowedUniverses = new Set(['6136926393', '10630513390', '9544855325']);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml' };

createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
    if (url.pathname === '/api/roblox') {
      const ids = (url.searchParams.get('universeIds') || '').split(',').filter((id) => allowedUniverses.has(id));
      if (!ids.length) return send(response, 400, 'application/json', JSON.stringify({ data: [] }));
      const upstream = await fetch(`https://games.roblox.com/v1/games?universeIds=${ids.join(',')}`);
      const body = await upstream.text();
      response.setHeader('Cache-Control', 'public, max-age=30');
      return send(response, upstream.status, 'application/json; charset=utf-8', body);
    }

    const route = url.pathname === '/' ? 'index.html' : url.pathname.replace(/^\/+/, '');
    const filePath = normalize(join(publicDir, decodeURIComponent(route)));
    if (!filePath.startsWith(normalize(publicDir))) return send(response, 403, 'text/plain', 'Forbidden');
    const body = await readFile(filePath);
    send(response, 200, types[extname(filePath)] || 'application/octet-stream', body);
  } catch (error) {
    send(response, error?.code === 'ENOENT' ? 404 : 500, 'text/plain', error?.code === 'ENOENT' ? 'Not found' : 'Server error');
  }
}).listen(port, () => console.log(`Do Finals Studios: http://localhost:${port}`));

function send(response, status, type, body) {
  response.writeHead(status, { 'Content-Type': type, 'X-Content-Type-Options': 'nosniff' });
  response.end(body);
}
