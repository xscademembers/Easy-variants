// Local API server that mirrors Vercel serverless functions.
// Vite proxies /api requests here in development.

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { readdirSync, statSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join, relative } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.API_PORT || 3001;
const API_DIR = join(__dirname, 'api');

const app = express();
app.use(cors());

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === '_lib' || entry.startsWith('.')) continue;
      walk(full, files);
    } else if (entry.endsWith('.js')) {
      files.push(full);
    }
  }
  return files;
}

async function mountRoutes() {
  const files = walk(API_DIR);

  // Media upload must run before express.json() so the raw stream is available.
  const mediaFile = files.find((f) => f.replace(/\\/g, '/').endsWith('admin/media.js'));
  if (mediaFile) {
    const mod = await import(pathToFileURL(mediaFile).href);
    const handler = mod.default;
    app.post('/api/admin/media', (req, res) => {
      Promise.resolve(handler(req, res)).catch((err) => {
        console.error('[dev-server] /api/admin/media threw:', err);
        if (!res.headersSent) res.status(500).json({ error: 'Internal server error.' });
      });
    });
    console.log('[dev-server]  /api/admin/media (multipart, raw body)');
  }

  app.use(express.json({ limit: '1mb' }));

  for (const file of files) {
    const rel = relative(API_DIR, file).replace(/\\/g, '/').replace(/\.js$/, '');
    const route = '/api/' + rel;
    if (route === '/api/admin/media') continue;

    const mod = await import(pathToFileURL(file).href);
    const handler = mod.default;
    if (typeof handler !== 'function') {
      console.warn(`[dev-server] ${file} has no default export, skipping.`);
      continue;
    }

    app.all(route, (req, res) => {
      Promise.resolve(handler(req, res)).catch((err) => {
        console.error(`[dev-server] ${route} threw:`, err);
        if (!res.headersSent) res.status(500).json({ error: 'Internal server error.' });
      });
    });
    console.log(`[dev-server]  ${route}`);
  }
}

mountRoutes()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n[dev-server] API ready at http://localhost:${PORT}/api`);
    });
  })
  .catch((err) => {
    console.error('[dev-server] Failed to start:', err);
    process.exit(1);
  });
