import { requireAdmin } from '../_lib/auth.js';
import { handleMediaUpload } from '../_lib/mediaUpload.js';

export default async function handler(req, res) {
  const admin = requireAdmin(req, res);
  if (!admin) return;

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const result = await handleMediaUpload(req);
    return res.status(200).json(result);
  } catch (err) {
    const status = err.statusCode || 500;
    if (status >= 500) console.error('POST /api/admin/media failed:', err);
    return res.status(status).json({ error: err.message || 'Upload failed.' });
  }
}

/** Vercel / dev-server: do not parse body before this handler runs. */
export const config = {
  api: {
    bodyParser: false,
  },
};
