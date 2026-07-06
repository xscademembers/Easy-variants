import { ALLOWED_CMS_KEYS, getFieldDef } from './cmsSchema.js';
import { decodeBlocks } from './blockKeyUtils.js';

const TEXT_MAX = 10000;
const URL_MAX = 2048;

function isNonEmptyString(value, maxLen = TEXT_MAX) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLen;
}

function isOptionalString(value, maxLen = TEXT_MAX) {
  return value === undefined || value === null || (typeof value === 'string' && value.length <= maxLen);
}

function isUrlLike(value) {
  if (typeof value !== 'string' || !value.trim()) return false;
  if (value.length > URL_MAX) return false;
  if (value.startsWith('/')) return true;
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function validateListItems(page, key, value) {
  const fieldDef = getFieldDef(page, key);
  if (!fieldDef?.itemFields) {
    return { ok: true, value };
  }

  const normalized = [];
  for (let i = 0; i < value.length; i += 1) {
    const item = value[i];
    if (!item || typeof item !== 'object') {
      return { ok: false, error: `List "${key}" item ${i + 1} must be an object.` };
    }
    const out = {};
    for (const sub of fieldDef.itemFields) {
      const raw = item[sub.key];
      if (!isNonEmptyString(raw, sub.type === 'text' ? 500 : TEXT_MAX)) {
        return { ok: false, error: `List "${key}" item ${i + 1}: "${sub.label}" is required.` };
      }
      out[sub.key] = String(raw).trim();
    }
    normalized.push(out);
  }
  return { ok: true, value: normalized };
}

/**
 * Validate and normalize a single content block.
 */
export function validateContentBlock(page, key, block) {
  if (!block || typeof block !== 'object') {
    return { ok: false, error: `Block "${key}" must be an object with type and value.` };
  }

  const { type, value } = block;

  if (type === 'text') {
    if (!isNonEmptyString(value)) {
      return { ok: false, error: `Block "${key}" text value must be a non-empty string.` };
    }
    return { ok: true, block: { type: 'text', value: value.trim() } };
  }

  if (type === 'image') {
    if (!value || typeof value !== 'object') {
      return { ok: false, error: `Block "${key}" image value must be { src, alt? }.` };
    }
    if (!isUrlLike(value.src)) {
      return { ok: false, error: `Block "${key}" image src must be a valid URL or site path.` };
    }
    if (!isOptionalString(value.alt, 500)) {
      return { ok: false, error: `Block "${key}" image alt is too long.` };
    }
    return {
      ok: true,
      block: {
        type: 'image',
        value: {
          src: String(value.src).trim(),
          alt: value.alt ? String(value.alt).trim() : '',
        },
      },
    };
  }

  if (type === 'video') {
    if (!value || typeof value !== 'object') {
      return { ok: false, error: `Block "${key}" video value must be { src, poster? }.` };
    }
    if (!isUrlLike(value.src)) {
      return { ok: false, error: `Block "${key}" video src must be a valid URL or site path.` };
    }
    if (value.poster && !isUrlLike(value.poster)) {
      return { ok: false, error: `Block "${key}" video poster must be a valid URL or site path.` };
    }
    return {
      ok: true,
      block: {
        type: 'video',
        value: {
          src: String(value.src).trim(),
          poster: value.poster ? String(value.poster).trim() : '',
        },
      },
    };
  }

  if (type === 'list') {
    if (!Array.isArray(value)) {
      return { ok: false, error: `Block "${key}" list value must be an array.` };
    }
    if (value.length > 50) {
      return { ok: false, error: `Block "${key}" list exceeds maximum length (50).` };
    }
    const listResult = validateListItems(page, key, value);
    if (!listResult.ok) return listResult;
    return { ok: true, block: { type: 'list', value: listResult.value } };
  }

  return { ok: false, error: `Block "${key}" has invalid type "${type}".` };
}

export function validateBlocksForPage(page, blocks) {
  const allowed = ALLOWED_CMS_KEYS[page];
  if (!allowed) {
    return { ok: false, error: `Unknown page "${page}".` };
  }
  if (!blocks || typeof blocks !== 'object' || Array.isArray(blocks)) {
    return { ok: false, error: 'blocks must be an object.' };
  }

  const keys = Object.keys(blocks);
  if (keys.length === 0) {
    return { ok: false, error: 'At least one block is required.' };
  }
  if (keys.length > 200) {
    return { ok: false, error: 'Too many blocks in one request (max 200).' };
  }

  const normalized = {};
  for (const key of keys) {
    if (!allowed.has(key)) {
      return { ok: false, error: `Key "${key}" is not allowed for page "${page}".` };
    }
    const result = validateContentBlock(page, key, blocks[key]);
    if (!result.ok) return result;
    normalized[key] = result.block;
  }

  return { ok: true, blocks: normalized };
}

/** Convert a Mongoose Content document (or lean object) to a plain blocks map for JSON. */
export function serializeBlocks(doc) {
  return decodeBlocks(doc?.blocks);
}

export function serializeDraftBlocks(doc) {
  return decodeBlocks(doc?.draftBlocks);
}

export function contentMeta(doc) {
  const draft = serializeDraftBlocks(doc);
  return {
    updatedAt: doc?.updatedAt || null,
    updatedBy: doc?.updatedBy || null,
    draftUpdatedAt: doc?.draftUpdatedAt || null,
    draftUpdatedBy: doc?.draftUpdatedBy || null,
    hasDraft: Object.keys(draft).length > 0,
  };
}

export { ALLOWED_CMS_KEYS };
