import Busboy from 'busboy';
import { put } from '@vercel/blob';
import { mkdir, writeFile } from 'fs/promises';
import { join, extname } from 'path';
import { randomBytes } from 'crypto';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOCAL_UPLOAD_DIR = join(__dirname, '../../public/uploads/cms');

export const MEDIA_LIMITS = {
  image: 5 * 1024 * 1024,
  poster: 5 * 1024 * 1024,
  video: 50 * 1024 * 1024,
};

const IMAGE_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const VIDEO_MIMES = new Set(['video/mp4', 'video/webm', 'video/quicktime']);

function extForMime(mime) {
  const map = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'video/mp4': '.mp4',
    'video/webm': '.webm',
    'video/quicktime': '.mov',
  };
  return map[mime] || extname(mime) || '';
}

function sanitizeBaseName(filename) {
  const base = String(filename || 'upload')
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9-_]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return base || 'upload';
}

function maxBytesForKind(kind) {
  if (kind === 'video') return MEDIA_LIMITS.video;
  if (kind === 'poster') return MEDIA_LIMITS.poster;
  return MEDIA_LIMITS.image;
}

function validateUpload(kind, mimeType, size) {
  const max = maxBytesForKind(kind);
  if (size > max) {
    const mb = Math.round(max / (1024 * 1024));
    return { ok: false, error: `File exceeds ${mb} MB limit for ${kind}.` };
  }

  if (kind === 'video') {
    if (!VIDEO_MIMES.has(mimeType)) {
      return { ok: false, error: 'Video must be MP4, WebM, or MOV.' };
    }
    return { ok: true };
  }

  if (!IMAGE_MIMES.has(mimeType)) {
    return { ok: false, error: 'Image must be JPEG, PNG, WebP, or GIF.' };
  }
  return { ok: true };
}

/**
 * Parse a single-file multipart request (field: kind, file: file).
 */
export function parseMultipartFile(req) {
  return new Promise((resolve, reject) => {
    const max = MEDIA_LIMITS.video;
    const busboy = Busboy({
      headers: req.headers,
      limits: { fileSize: max, files: 1, fields: 4 },
    });

    let kind = 'image';
    let buffer = null;
    let filename = 'upload';
    let mimeType = 'application/octet-stream';
    let size = 0;
    let limitHit = false;

    busboy.on('field', (name, value) => {
      if (name === 'kind') kind = String(value || 'image').toLowerCase();
    });

    busboy.on('file', (_name, file, info) => {
      filename = info.filename || 'upload';
      mimeType = info.mimeType || 'application/octet-stream';
      const chunks = [];

      file.on('data', (chunk) => {
        size += chunk.length;
        chunks.push(chunk);
      });

      file.on('limit', () => {
        limitHit = true;
        file.resume();
      });

      file.on('end', () => {
        if (!limitHit) buffer = Buffer.concat(chunks);
      });
    });

    busboy.on('error', reject);

    busboy.on('finish', () => {
      if (limitHit) {
        reject(new Error(`File exceeds maximum upload size.`));
        return;
      }
      if (!buffer || !buffer.length) {
        reject(new Error('No file uploaded.'));
        return;
      }
      resolve({ kind, buffer, filename, mimeType, size: buffer.length });
    });

    req.pipe(busboy);
  });
}

async function storeLocal(buffer, filename, mimeType) {
  await mkdir(LOCAL_UPLOAD_DIR, { recursive: true });
  const suffix = randomBytes(6).toString('hex');
  const safe = `${sanitizeBaseName(filename)}-${suffix}${extForMime(mimeType)}`;
  const fullPath = join(LOCAL_UPLOAD_DIR, safe);
  await writeFile(fullPath, buffer);
  return {
    src: `/uploads/cms/${safe}`,
    pathname: safe,
    size: buffer.length,
    mime: mimeType,
    storage: 'local',
  };
}

async function storeBlob(buffer, filename, mimeType) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return storeLocal(buffer, filename, mimeType);
  }

  const pathname = `cms/${sanitizeBaseName(filename)}-${randomBytes(6).toString('hex')}${extForMime(mimeType)}`;
  const blob = await put(pathname, buffer, {
    access: 'public',
    addRandomSuffix: false,
    contentType: mimeType,
    token,
  });

  return {
    src: blob.url,
    pathname: blob.pathname,
    size: buffer.length,
    mime: mimeType,
    storage: 'blob',
  };
}

export async function handleMediaUpload(req) {
  const parsed = await parseMultipartFile(req);
  const validation = validateUpload(parsed.kind, parsed.mimeType, parsed.size);
  if (!validation.ok) {
    const err = new Error(validation.error);
    err.statusCode = 400;
    throw err;
  }

  const result = await storeBlob(parsed.buffer, parsed.filename, parsed.mimeType);
  return {
    ok: true,
    kind: parsed.kind,
    ...result,
  };
}
