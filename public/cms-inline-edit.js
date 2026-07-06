/**
 * EasyVariants visual edit mode.
 * Activated by ?cms-edit=1 on a public page when the admin is logged in.
 * Lets admins click text/images on the real site, edit, then Save draft / Publish live.
 */
(function () {
  'use strict';

  const TOKEN_KEY = 'ev_admin_token';

  const SECTION_LABELS = {
    header: 'Top navigation',
    hero: 'Hero',
    meet: 'Meet EasyVariants',
    problem: 'The Problem',
    advantage: 'Advantage',
    inside: 'Inside EasyVariants',
    solution: 'Our Solution',
    workflow: 'Workflow',
    demos: 'Demo Videos',
    cta: 'Final CTA',
    footer: 'Footer',
    contact: 'Contact page',
  };

  const KEY_LABELS = {
    'header.cta.label': 'Nav demo button',
    'header.cta.href': 'Nav demo button link',
    'hero.eyebrow': 'Hero eyebrow',
    'hero.title.line1': 'Hero headline (line 1)',
    'hero.title.line2': 'Hero headline (line 2)',
    'hero.description': 'Hero description',
    'hero.cta.primary.label': 'Hero primary button',
    'hero.cta.primary.href': 'Hero primary button link',
    'hero.cta.secondary.label': 'Hero secondary button',
    'hero.cta.secondary.href': 'Hero secondary button link',
    'hero.image': 'Hero image',
  };

  function hasAdminToken() {
    return Boolean(localStorage.getItem(TOKEN_KEY));
  }

  function isEditModeUrl() {
    return new URLSearchParams(window.location.search).get('cms-edit') === '1';
  }

  function buildEditUrl(page) {
    const url = page === 'contact' ? '/contactus.html' : '/';
    return `${url}?cms-edit=1`;
  }

  function buildPreviewUrl(page) {
    const url = page === 'contact' ? '/contactus.html' : '/';
    return `${url}?preview=draft`;
  }

  function buildExitUrl() {
    const url = new URL(window.location.href);
    url.searchParams.delete('cms-edit');
    return url.pathname + (url.search || '') + (url.hash || '');
  }

  function humanLabel(key) {
    if (KEY_LABELS[key]) return KEY_LABELS[key];
    const [root] = key.split('.');
    const section = SECTION_LABELS[root] || root;
    const rest = key
      .split('.')
      .slice(1)
      .map((part) => part.replace(/-/g, ' '))
      .join(' · ');
    return rest ? `${section} · ${rest}` : section;
  }

  function injectStyles() {
    if (document.getElementById('ez-cms-edit-styles')) return;
    const style = document.createElement('style');
    style.id = 'ez-cms-edit-styles';
    style.textContent = `
      body.ez-cms-edit-mode { padding-top: 48px; }
      body.ez-cms-edit-mode nav.fixed { top: 48px !important; }

      #ez-cms-edit-bar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 10px 20px;
        background: linear-gradient(180deg, #1a1259 0%, #3525cd 100%);
        color: #fff;
        font-family: Manrope, Inter, system-ui, sans-serif;
        font-size: 0.875rem;
        box-shadow: 0 4px 24px rgba(15, 12, 41, 0.25);
        flex-wrap: wrap;
      }
      #ez-cms-edit-bar .ez-edit-brand {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 700;
      }
      #ez-cms-edit-bar .ez-edit-page-picker {
        background: rgba(255, 255, 255, 0.12);
        border: 1px solid rgba(255, 255, 255, 0.25);
        border-radius: 999px;
        color: #fff;
        font: inherit;
        font-weight: 600;
        padding: 4px 10px;
        cursor: pointer;
      }
      #ez-cms-edit-bar .ez-edit-page-picker option { color: #1a1259; }
      #ez-cms-edit-bar .ez-edit-status {
        font-size: 0.8125rem;
        color: rgba(255, 255, 255, 0.85);
      }
      #ez-cms-edit-bar .ez-edit-status strong { color: #ffd966; }
      #ez-cms-edit-bar .ez-edit-actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      .ez-edit-btn {
        border: none;
        border-radius: 999px;
        padding: 7px 14px;
        font: inherit;
        font-weight: 700;
        font-size: 0.8125rem;
        cursor: pointer;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        line-height: 1;
      }
      .ez-edit-btn--primary { background: #ffd966; color: #1a1259; }
      .ez-edit-btn--primary:disabled { background: rgba(255, 217, 102, 0.4); cursor: not-allowed; }
      .ez-edit-btn--ghost {
        background: rgba(255, 255, 255, 0.15);
        color: #fff;
        border: 1px solid rgba(255, 255, 255, 0.25);
      }
      .ez-edit-btn--ghost:hover { background: rgba(255, 255, 255, 0.25); }
      .ez-edit-btn--exit {
        background: transparent;
        color: rgba(255, 255, 255, 0.85);
        border: 1px solid rgba(255, 255, 255, 0.35);
      }

      body.ez-cms-edit-mode [data-cms-key] {
        position: relative;
        outline: 1px dashed rgba(53, 37, 205, 0.0);
        outline-offset: 4px;
        transition: outline-color 0.15s ease, background-color 0.15s ease;
        cursor: pointer;
      }
      body.ez-cms-edit-mode [data-cms-key]:hover {
        outline-color: rgba(53, 37, 205, 0.6);
        background-color: rgba(255, 217, 102, 0.08);
      }
      body.ez-cms-edit-mode [data-cms-key][data-ez-dirty="1"] {
        outline: 2px solid #ffd966;
        outline-offset: 4px;
      }
      body.ez-cms-edit-mode [data-cms-key][data-ez-editing="1"] {
        outline: 2px solid #3525cd;
        outline-offset: 4px;
        background-color: rgba(255, 217, 102, 0.18);
        color: inherit;
        cursor: text;
      }
      body.ez-cms-edit-mode [contenteditable="true"] {
        cursor: text;
        outline: none;
        color: inherit;
        background-color: transparent;
        caret-color: currentColor;
      }
      /* Keep text visible on dark/coloured cards (e.g. solution accent cards) */
      body.ez-cms-edit-mode .solution-feature-card--accent [data-cms-key][data-ez-editing="1"],
      body.ez-cms-edit-mode .solution-feature-card--accent [contenteditable="true"] {
        color: rgba(255, 255, 255, 0.92);
        -webkit-text-fill-color: rgba(255, 255, 255, 0.92);
      }
      body.ez-cms-edit-mode a[data-cms-key]:not([data-ez-editing="1"]) {
        pointer-events: auto;
      }

      .ez-edit-popover {
        position: fixed;
        z-index: 100000;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 16px 48px rgba(15, 12, 41, 0.25);
        padding: 14px;
        min-width: 320px;
        font-family: Manrope, Inter, system-ui, sans-serif;
        font-size: 0.875rem;
        color: #1a1c1d;
      }
      .ez-edit-popover h4 {
        margin: 0 0 10px;
        font-size: 0.8125rem;
        color: #3525cd;
        font-weight: 700;
      }
      .ez-edit-popover label {
        display: block;
        font-size: 0.75rem;
        font-weight: 600;
        color: #464555;
        margin: 8px 0 4px;
      }
      .ez-edit-popover input,
      .ez-edit-popover textarea {
        width: 100%;
        font: inherit;
        padding: 8px 10px;
        border: 1px solid rgba(199, 196, 216, 0.6);
        border-radius: 8px;
        color: #1a1c1d;
      }
      .ez-edit-popover textarea { min-height: 80px; resize: vertical; }
      .ez-edit-popover .ez-edit-popover-actions {
        display: flex;
        gap: 6px;
        margin-top: 12px;
        flex-wrap: wrap;
      }
      .ez-edit-popover .ez-edit-popover-actions button {
        border: none;
        padding: 6px 12px;
        border-radius: 999px;
        font: inherit;
        font-size: 0.75rem;
        font-weight: 700;
        cursor: pointer;
      }
      .ez-edit-popover .primary { background: #3525cd; color: #fff; }
      .ez-edit-popover .ghost { background: #f3f2f8; color: #464555; }

      .ez-edit-toast {
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: #1a1259;
        color: #fff;
        padding: 12px 18px;
        border-radius: 12px;
        font-family: Manrope, Inter, system-ui, sans-serif;
        font-size: 0.875rem;
        font-weight: 600;
        box-shadow: 0 12px 32px rgba(15, 12, 41, 0.3);
        z-index: 100001;
        opacity: 0;
        transform: translateY(8px);
        transition: opacity 0.2s ease, transform 0.2s ease;
        max-width: 360px;
      }
      .ez-edit-toast.show { opacity: 1; transform: translateY(0); }
      .ez-edit-toast--error { background: #b91c1c; }
      .ez-edit-toast--success { background: #15803d; }

      #ez-cms-edit-overlay {
        position: fixed;
        inset: 0;
        background: rgba(15, 12, 41, 0.45);
        z-index: 99998;
        display: none;
      }
      #ez-cms-edit-overlay.is-open { display: block; }

      @media (max-width: 768px) {
        #ez-cms-edit-bar { font-size: 0.8125rem; padding: 8px 12px; }
        .ez-edit-btn { padding: 6px 10px; font-size: 0.75rem; }
      }
    `;
    document.head.appendChild(style);
  }

  /* ─── State ─── */
  const state = {
    page: null,
    publishedBlocks: {}, // server-known blocks (published + draft merged)
    dirty: new Map(), // key → block (changed)
    hasDraft: false, // saved draft on server, not yet published
  };

  function markDirty(key, block) {
    state.dirty.set(key, block);
    document
      .querySelectorAll(`[data-cms-key="${cssEscape(key)}"]`)
      .forEach((el) => el.setAttribute('data-ez-dirty', '1'));
    updateStatus();
  }

  function clearDirty() {
    state.dirty.clear();
    document
      .querySelectorAll('[data-ez-dirty="1"]')
      .forEach((el) => el.removeAttribute('data-ez-dirty'));
    updateStatus();
  }

  function cssEscape(s) {
    return String(s).replace(/[^a-zA-Z0-9_-]/g, (c) => `\\${c}`);
  }

  /** Normalize block keys to logical CMS form (hero.title.line1, not storage-encoded). */
  function sanitizeBlocks(blocks) {
    const out = {};
    for (const [key, block] of Object.entries(blocks || {})) {
      const logical = String(key).replace(/\uE000/g, '.');
      out[logical] = block;
    }
    return out;
  }

  function updateStatus() {
    const status = document.getElementById('ez-cms-edit-status');
    if (!status) return;
    const n = state.dirty.size;
    if (n > 0) {
      status.innerHTML = `<strong>${n}</strong> unsaved change${n === 1 ? '' : 's'}`;
    } else if (state.hasDraft) {
      status.innerHTML = 'Draft saved — ready to publish';
    } else {
      status.innerHTML = 'All changes saved';
    }
    // Buttons stay enabled so clicks always give feedback; save() will toast
    // "Nothing to save yet" if there's no work to do.
    const saveBtn = document.getElementById('ez-cms-save-draft');
    const pubBtn = document.getElementById('ez-cms-publish');
    const discardBtn = document.getElementById('ez-cms-discard');
    if (saveBtn) saveBtn.disabled = false;
    if (pubBtn) pubBtn.disabled = false;
    if (discardBtn) discardBtn.disabled = false;
  }

  /* ─── Toast ─── */
  let toastTimer = null;
  function toast(message, type = 'success') {
    let t = document.getElementById('ez-cms-edit-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'ez-cms-edit-toast';
      t.className = 'ez-edit-toast';
      document.body.appendChild(t);
    }
    t.textContent = message;
    t.className = `ez-edit-toast ez-edit-toast--${type} show`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
  }

  /* ─── Top bar ─── */
  function buildBar(page) {
    if (document.getElementById('ez-cms-edit-bar')) return;

    const bar = document.createElement('div');
    bar.id = 'ez-cms-edit-bar';
    bar.innerHTML = `
      <div class="ez-edit-brand">
        <span class="material-symbols-outlined" aria-hidden="true" style="font-size:20px;">edit_note</span>
        <span>Editing:</span>
        <select class="ez-edit-page-picker" id="ez-cms-page-picker" aria-label="Switch page">
          <option value="home"${page === 'home' ? ' selected' : ''}>Homepage</option>
          <option value="contact"${page === 'contact' ? ' selected' : ''}>Contact page</option>
        </select>
        <span class="ez-edit-status" id="ez-cms-edit-status">All changes saved</span>
      </div>
      <div class="ez-edit-actions">
        <button class="ez-edit-btn ez-edit-btn--ghost" id="ez-cms-discard" type="button">Discard</button>
        <button class="ez-edit-btn ez-edit-btn--ghost" id="ez-cms-save-draft" type="button">Save draft</button>
        <button class="ez-edit-btn ez-edit-btn--primary" id="ez-cms-publish" type="button">Publish live</button>
        <a class="ez-edit-btn ez-edit-btn--ghost" id="ez-cms-preview" href="${buildPreviewUrl(page)}" target="_blank" rel="noopener noreferrer">Preview draft</a>
        <a class="ez-edit-btn ez-edit-btn--exit" href="/admin/dashboard.html">Back to admin</a>
        <a class="ez-edit-btn ez-edit-btn--exit" href="${buildExitUrl()}">Exit</a>
      </div>
    `;
    document.body.appendChild(bar);

    document.getElementById('ez-cms-page-picker').addEventListener('change', (e) => {
      const next = e.target.value;
      if (state.dirty.size && !confirm('You have unsaved changes. Discard and switch page?')) {
        e.target.value = state.page;
        return;
      }
      window.location.href = buildEditUrl(next);
    });

    document.getElementById('ez-cms-discard').addEventListener('click', () => {
      window.location.reload();
    });

    document.getElementById('ez-cms-save-draft').addEventListener('click', () => save('draft'));
    document.getElementById('ez-cms-publish').addEventListener('click', () => save('publish'));

    window.addEventListener('beforeunload', (e) => {
      if (state.dirty.size === 0) return;
      e.preventDefault();
      e.returnValue = '';
    });
  }

  /* ─── Inline editing of text ─── */
  function cleanText(el) {
    // Only capture top-level text nodes — ignore any injected helper elements.
    let out = '';
    el.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        out += node.nodeValue;
      } else if (
        node.nodeType === Node.ELEMENT_NODE &&
        !node.classList?.contains('ez-edit-tag') &&
        !node.hasAttribute?.('data-cms-key')
      ) {
        out += node.textContent || '';
      }
    });
    return out.trim();
  }

  function makeTextEditable(el, key) {
    if (el.getAttribute('data-ez-editing') === '1') return;
    el.setAttribute('data-ez-editing', '1');
    el.setAttribute('contenteditable', 'true');
    el.focus();

    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    const originalHtml = el.innerHTML;
    const originalText = cleanText(el);

    const finish = (commit) => {
      el.removeEventListener('blur', onBlur);
      el.removeEventListener('keydown', onKey);
      el.removeAttribute('contenteditable');
      el.removeAttribute('data-ez-editing');
      const next = cleanText(el);
      if (commit && next !== originalText) {
        el.textContent = next;
        markDirty(key, { type: 'text', value: next });
      } else {
        el.innerHTML = originalHtml;
      }
    };

    const onBlur = () => finish(true);
    const onKey = (e) => {
      if (e.key === 'Enter' && !e.shiftKey && el.tagName !== 'TEXTAREA') {
        e.preventDefault();
        el.blur();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        finish(false);
      }
    };

    el.addEventListener('blur', onBlur);
    el.addEventListener('keydown', onKey);
  }

  /* ─── Popover (links + images) ─── */
  let activePopover = null;

  function closePopover() {
    if (activePopover) {
      activePopover.remove();
      activePopover = null;
    }
    const overlay = document.getElementById('ez-cms-edit-overlay');
    if (overlay) overlay.classList.remove('is-open');
  }

  function openPopover({ anchorEl, html, onConfirm }) {
    closePopover();

    let overlay = document.getElementById('ez-cms-edit-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'ez-cms-edit-overlay';
      overlay.addEventListener('click', closePopover);
      document.body.appendChild(overlay);
    }
    overlay.classList.add('is-open');

    const pop = document.createElement('div');
    pop.className = 'ez-edit-popover';
    pop.innerHTML = html;
    document.body.appendChild(pop);
    activePopover = pop;

    const rect = anchorEl.getBoundingClientRect();
    const top = Math.min(window.innerHeight - 320, Math.max(80, rect.bottom + 8));
    const left = Math.min(window.innerWidth - 360, Math.max(16, rect.left));
    pop.style.top = `${top}px`;
    pop.style.left = `${left}px`;

    pop.querySelector('[data-action="cancel"]')?.addEventListener('click', closePopover);
    pop.querySelector('[data-action="confirm"]')?.addEventListener('click', () => {
      onConfirm(pop);
    });

    setTimeout(() => {
      pop.querySelector('input, textarea')?.focus();
    }, 50);
  }

  function editLink(el, key) {
    const labelKey = key.replace(/\.href$/, '.label');
    const currentHref = el.getAttribute('href') || '';
    const currentLabel = (() => {
      const labelEl = el.querySelector(`[data-cms-key="${cssEscape(labelKey)}"]`);
      return labelEl ? labelEl.textContent.trim() : el.textContent.trim();
    })();

    openPopover({
      anchorEl: el,
      html: `
        <h4>${humanLabel(key)}</h4>
        <label>Button label</label>
        <input data-field="label" type="text" value="${escapeAttr(currentLabel)}" />
        <label>Link URL or path</label>
        <input data-field="href" type="text" value="${escapeAttr(currentHref)}" placeholder="/contactus.html or #demos" />
        <div class="ez-edit-popover-actions">
          <button class="primary" data-action="confirm" type="button">Apply</button>
          <button class="ghost" data-action="cancel" type="button">Cancel</button>
        </div>
      `,
      onConfirm: (pop) => {
        const newHref = pop.querySelector('[data-field="href"]').value.trim();
        const newLabel = pop.querySelector('[data-field="label"]').value.trim();
        if (newHref && newHref !== currentHref) {
          el.setAttribute('href', newHref);
          markDirty(key, { type: 'text', value: newHref });
        }
        if (newLabel && newLabel !== currentLabel) {
          const labelEl = el.querySelector(`[data-cms-key="${cssEscape(labelKey)}"]`);
          if (labelEl) {
            labelEl.textContent = newLabel;
            markDirty(labelKey, { type: 'text', value: newLabel });
          }
        }
        closePopover();
      },
    });
  }

  async function uploadFile(file, kind) {
    const token = localStorage.getItem(TOKEN_KEY);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('kind', kind);
    const res = await fetch('/api/admin/media', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed.');
    return data;
  }

  function editImage(el, key) {
    const current = {
      src: el.getAttribute('src') || '',
      alt: el.getAttribute('alt') || '',
    };

    openPopover({
      anchorEl: el,
      html: `
        <h4>${humanLabel(key)}</h4>
        <label>Upload new image</label>
        <input data-field="file" type="file" accept="image/jpeg,image/png,image/webp,image/gif" />
        <label>Image URL or path</label>
        <input data-field="src" type="text" value="${escapeAttr(current.src)}" />
        <label>Alt text (describe the image)</label>
        <input data-field="alt" type="text" value="${escapeAttr(current.alt)}" />
        <div class="ez-edit-popover-actions">
          <button class="primary" data-action="confirm" type="button">Apply</button>
          <button class="ghost" data-action="cancel" type="button">Cancel</button>
        </div>
      `,
      onConfirm: async (pop) => {
        const fileInput = pop.querySelector('[data-field="file"]');
        const srcInput = pop.querySelector('[data-field="src"]');
        const altInput = pop.querySelector('[data-field="alt"]');
        const file = fileInput.files?.[0];

        try {
          if (file) {
            toast('Uploading image…', 'success');
            const up = await uploadFile(file, 'image');
            srcInput.value = up.src;
          }
          const next = {
            src: srcInput.value.trim(),
            alt: altInput.value.trim(),
          };
          if (next.src !== current.src) el.setAttribute('src', next.src);
          if (next.alt !== current.alt) el.setAttribute('alt', next.alt);
          if (next.src !== current.src || next.alt !== current.alt) {
            markDirty(key, { type: 'image', value: next });
          }
          closePopover();
        } catch (err) {
          toast(err.message || 'Upload failed.', 'error');
        }
      },
    });
  }

  function editComplex(el, key) {
    openPopover({
      anchorEl: el,
      html: `
        <h4>${humanLabel(key)}</h4>
        <p style="margin:0 0 8px;color:#6b7280;font-size:.8125rem;">
          This field type is best edited in the admin form (videos, lists, etc.).
        </p>
        <div class="ez-edit-popover-actions">
          <a class="primary" href="/admin/dashboard.html?tab=content&page=${encodeURIComponent(state.page)}&key=${encodeURIComponent(key)}" style="text-decoration:none;display:inline-block;padding:6px 12px;">Open in admin</a>
          <button class="ghost" data-action="cancel" type="button">Cancel</button>
        </div>
      `,
      onConfirm: () => {},
    });
  }

  function escapeAttr(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  /* ─── Click bindings ─── */
  function bindElements() {
    document.querySelectorAll('[data-cms-key]').forEach((el) => {
      if (el.dataset.ezBound === '1') return;
      el.dataset.ezBound = '1';

      const key = el.getAttribute('data-cms-key');
      if (!key) return;

      const pos = window.getComputedStyle(el).position;
      if (pos === 'static') el.style.position = 'relative';

      // Hover hint via native tooltip — does NOT pollute textContent
      if (!el.getAttribute('title')) {
        el.setAttribute('title', `Click to edit · ${humanLabel(key)}`);
      }

      el.addEventListener('click', (e) => {
        if (el.getAttribute('data-ez-editing') === '1') return;

        // Don't open editor when clicking the tag itself or nested editable child
        const innerEditable = e.target.closest('[data-cms-key]');
        if (innerEditable && innerEditable !== el) return;

        e.preventDefault();
        e.stopPropagation();

        if (el.tagName === 'A') {
          if (key.endsWith('.href')) {
            editLink(el, key);
          } else {
            // Anchor with label key — edit text inside
            makeTextEditable(el, key);
          }
          return;
        }

        if (el.tagName === 'IMG') {
          editImage(el, key);
          return;
        }

        if (el.tagName === 'VIDEO') {
          editComplex(el, key);
          return;
        }

        // Default: editable text
        makeTextEditable(el, key);
      });
    });

    // Block stray navigation while editing
    document.querySelectorAll('a:not([data-cms-key])').forEach((a) => {
      if (a.dataset.ezNavBound === '1') return;
      a.dataset.ezNavBound = '1';
      a.addEventListener('click', (e) => {
        if (a.closest('#ez-cms-edit-bar')) return;
        const href = a.getAttribute('href') || '';
        if (href.startsWith('#')) return; // allow anchor jumps
        e.preventDefault();
        toast('Navigation is disabled in edit mode. Use the top bar to exit.', 'success');
      });
    });
  }

  /* ─── Save ─── */
  async function save(mode) {
    console.log('[cms] save() called with mode=%s', mode, {
      dirty: state.dirty.size,
      hasDraft: state.hasDraft,
      publishedKeys: Object.keys(state.publishedBlocks).length,
    });

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      toast('Session expired. Log in again.', 'error');
      setTimeout(() => (window.location.href = '/admin/login.html'), 1500);
      return;
    }

    const merged = sanitizeBlocks({
      ...state.publishedBlocks,
      ...Object.fromEntries(state.dirty),
    });

    if (Object.keys(merged).length === 0) {
      toast('Nothing to save yet — edit some text first.', 'error');
      return;
    }

    const saveBtn = document.getElementById('ez-cms-save-draft');
    const pubBtn = document.getElementById('ez-cms-publish');
    if (saveBtn) saveBtn.disabled = true;
    if (pubBtn) pubBtn.disabled = true;
    toast(mode === 'draft' ? 'Saving draft…' : 'Publishing…', 'success');

    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ page: state.page, blocks: merged, mode }),
      });
      console.log('[cms] PUT /api/admin/content status=%s', res.status);
      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error(`Server returned ${res.status} (no JSON). Is the dev server restarted?`);
      }
      if (!res.ok) throw new Error(data.error || `Save failed (HTTP ${res.status}).`);

      console.log('[cms] save response', data);

      state.publishedBlocks = sanitizeBlocks({
        ...(data.blocks || {}),
        ...(data.draftBlocks || {}),
      });
      state.hasDraft = mode === 'draft' ? true : Boolean(data.hasDraft);
      clearDirty();
      toast(
        mode === 'draft'
          ? 'Draft saved. Click Publish live to push to visitors.'
          : 'Published live. Refresh the public site to verify.',
        'success'
      );
    } catch (err) {
      console.error('[cms] save failed', err);
      toast(err.message || 'Save failed.', 'error');
    } finally {
      updateStatus();
    }
  }

  /* ─── Init ─── */
  function activate(detail) {
    if (document.body.classList.contains('ez-cms-edit-mode')) return;

    state.page = detail.page;
    state.publishedBlocks = sanitizeBlocks(detail.blocks || {});
    state.hasDraft = Boolean(detail.hasDraft);

    injectStyles();
    document.body.classList.add('ez-cms-edit-mode');
    buildBar(state.page);
    bindElements();
    updateStatus();

    // Re-bind whenever the CMS loader replaces elements (e.g. lists)
    document.addEventListener('ez-cms-loaded', (e) => {
      state.publishedBlocks = sanitizeBlocks(e.detail?.blocks || state.publishedBlocks);
      bindElements();
    });
  }

  function init() {
    if (!isEditModeUrl()) return;
    if (!hasAdminToken()) {
      // Not logged in — bounce to admin login with return path
      const next = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.replace(`/admin/login.html?next=${next}`);
      return;
    }

    // If the loader already announced data, activate now; else wait.
    if (window.__EZ_CMS__) {
      activate(window.__EZ_CMS__);
    } else {
      document.addEventListener('ez-cms-loaded', function once(e) {
        document.removeEventListener('ez-cms-loaded', once);
        activate(e.detail);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
