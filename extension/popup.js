// Brief Engine — Editorial OS
// Structured briefs that power every downstream workflow.
// Fully client-side: no API calls, no network, no data collection.
// Output is a portable JSON brief you can hand to any tool or team.

// ============================================
// SCHEMA
// ============================================

const getInitialBrief = () => ({
  core: {
    project_name: '',
    objective: { primary: '', secondary: '' },
    success_metric_kpi: '',
    audience: { primary: '', secondary: '' },
    audience_awareness_level: '',
    key_message_single_truth: '',
    proof_points_reasons_to_believe: [],
    constraints: {
      timeline: '',
      channels: [],
      tone: [],
      must_include: [],
      must_avoid: []
    }
  },
  marketing: {
    planning_context: {
      campaign_type: '',
      seasonality: '',
      funnel_stage: '',
      offer_type: '',
      cta: { primary: '', secondary: '' }
    },
    audience_depth: {
      job_to_be_done: '',
      pain_points: [],
      objections: [],
      motivators: []
    },
    channels: {
      primary_channel: '',
      supporting_channels: [],
      channel_role: '',
      media_type: ''
    },
    brand_market: {
      brand_positioning_reminder: '',
      competitive_set: [],
      differentiation_angle: '',
      compliance_legal_flags: ''
    }
  }
});

// Module registry. Additional Track modules (editorial, design, product…)
// plug in here: add a key to the schema above, an entry below, and a
// renderer in MODULE_RENDERERS. Nothing else changes.
const MODULES = [
  { id: 'marketing', label: 'Marketing' }
];

const AWARENESS_LEVELS = [
  '', 'Unaware', 'Problem-aware', 'Solution-aware', 'Product-aware', 'Most aware'
];

const FUNNEL_STAGES = ['', 'Awareness', 'Consideration', 'Conversion', 'Retention', 'Advocacy'];

const CHANNEL_OPTIONS = ['Email', 'Social', 'Web', 'Paid media', 'Press', 'Events', 'Internal'];

const TONE_OPTIONS = ['Authoritative', 'Warm', 'Direct', 'Playful', 'Formal', 'Technical', 'Inspirational'];

// ============================================
// STATE
// ============================================

const state = {
  brief: getInitialBrief(),
  activeModules: [],
  outputTab: 'brief'
};

// ============================================
// DRAFT PERSISTENCE
// Popups reset when they close; the draft is autosaved to
// chrome.storage.local (this device only) so work isn't lost.
// ============================================

let saveTimer = null;

function saveDraft() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    chrome.storage.local.set({
      briefDraft: state.brief,
      briefModules: state.activeModules
    });
  }, 400);
}

function loadDraft(callback) {
  chrome.storage.local.get(['briefDraft', 'briefModules'], (result) => {
    if (result.briefDraft) {
      // Merge over the initial schema so new fields added in future
      // versions don't break old drafts.
      state.brief = deepMerge(getInitialBrief(), result.briefDraft);
    }
    if (Array.isArray(result.briefModules)) {
      state.activeModules = result.briefModules;
    }
    callback();
  });
}

function deepMerge(base, saved) {
  for (const key of Object.keys(base)) {
    if (saved[key] === undefined) continue;
    if (Array.isArray(base[key])) {
      base[key] = Array.isArray(saved[key]) ? saved[key] : base[key];
    } else if (typeof base[key] === 'object' && base[key] !== null) {
      base[key] = deepMerge(base[key], saved[key] || {});
    } else {
      base[key] = saved[key];
    }
  }
  return base;
}

function resetBrief() {
  state.brief = getInitialBrief();
  state.activeModules = [];
  chrome.storage.local.remove(['briefDraft', 'briefModules']);
  render();
}

// ============================================
// HELPERS
// ============================================

function getByPath(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

function setByPath(obj, path, value) {
  const keys = path.split('.');
  const last = keys.pop();
  const target = keys.reduce((o, k) => o[k], obj);
  target[last] = value;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = String(text ?? '');
  return div.innerHTML;
}

function escapeAttr(text) {
  return String(text ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

// Strip inactive modules from the exported brief
function getOutputBrief() {
  const output = { core: state.brief.core };
  for (const mod of MODULES) {
    if (state.activeModules.includes(mod.id)) {
      output[mod.id] = state.brief[mod.id];
    }
  }
  return output;
}

// ============================================
// ACTIONS
// ============================================

async function copyJSON(btn) {
  const json = JSON.stringify(getOutputBrief(), null, 2);
  try {
    await navigator.clipboard.writeText(json);
    flashButton(btn, 'Copied');
  } catch (err) {
    console.error('Copy failed:', err);
  }
}

async function copyBriefText(btn) {
  try {
    await navigator.clipboard.writeText(renderBriefPlainText());
    flashButton(btn, 'Copied');
  } catch (err) {
    console.error('Copy failed:', err);
  }
}

function flashButton(btn, label) {
  const original = btn.textContent;
  btn.classList.add('copied');
  btn.textContent = label;
  setTimeout(() => {
    btn.classList.remove('copied');
    btn.textContent = original;
  }, 2000);
}

function downloadJSON() {
  const json = JSON.stringify(getOutputBrief(), null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const name = state.brief.core.project_name || 'brief';
  const timestamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `${name.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function toggleModule(moduleId) {
  const index = state.activeModules.indexOf(moduleId);
  if (index > -1) state.activeModules.splice(index, 1);
  else state.activeModules.push(moduleId);
  saveDraft();
  render();
}

function addTag(path, value) {
  const trimmed = value.trim();
  if (!trimmed) return;
  const arr = getByPath(state.brief, path);
  if (Array.isArray(arr) && !arr.includes(trimmed)) arr.push(trimmed);
  saveDraft();
  render();
  focusTagInput(path);
}

function removeTag(path, index) {
  const arr = getByPath(state.brief, path);
  if (Array.isArray(arr)) arr.splice(index, 1);
  saveDraft();
  render();
}

function toggleChip(path, value) {
  const arr = getByPath(state.brief, path);
  const index = arr.indexOf(value);
  if (index > -1) arr.splice(index, 1);
  else arr.push(value);
  saveDraft();
  render();
}

function focusTagInput(path) {
  const input = document.querySelector(`.tag-input[data-tag-path="${path}"]`);
  if (input) input.focus();
}

// ============================================
// FIELD RENDERERS
// ============================================

function textField(label, path, placeholder = '', textarea = false) {
  const value = getByPath(state.brief, path) || '';
  const tag = textarea ? 'textarea' : 'input type="text"';
  const inner = textarea ? escapeHtml(value) : '';
  const valueAttr = textarea ? '' : `value="${escapeAttr(value)}"`;
  return `
    <div class="field-group">
      <label>${label}</label>
      <${tag} data-path="${path}" placeholder="${escapeAttr(placeholder)}" ${valueAttr}>${textarea ? inner + '</textarea>' : ''}
    </div>
  `;
}

function selectField(label, path, options) {
  const value = getByPath(state.brief, path) || '';
  return `
    <div class="field-group">
      <label>${label}</label>
      <select data-path="${path}">
        ${options.map(opt => `
          <option value="${escapeAttr(opt)}" ${value === opt ? 'selected' : ''}>${opt || 'Select…'}</option>
        `).join('')}
      </select>
    </div>
  `;
}

function tagField(label, path, placeholder = 'Type and press Enter') {
  const tags = getByPath(state.brief, path) || [];
  return `
    <div class="field-group">
      <label>${label}</label>
      <div class="tag-input-container" data-tag-container="${path}">
        ${tags.map((tag, i) => `
          <span class="tag">${escapeHtml(tag)}<button class="tag-remove" data-tag-remove="${path}" data-tag-index="${i}" title="Remove">&times;</button></span>
        `).join('')}
        <input type="text" class="tag-input" data-tag-path="${path}" placeholder="${escapeAttr(placeholder)}">
      </div>
    </div>
  `;
}

function chipField(label, path, options) {
  const selected = getByPath(state.brief, path) || [];
  return `
    <div class="field-group">
      <label>${label}</label>
      <div class="chip-container">
        ${options.map(opt => `
          <button class="chip ${selected.includes(opt) ? 'selected' : ''}" data-chip-path="${path}" data-chip-value="${escapeAttr(opt)}">${opt}</button>
        `).join('')}
      </div>
    </div>
  `;
}

// ============================================
// MODULE RENDERERS
// ============================================

function renderCoreModule() {
  return `
    <div class="section">
      <div class="section-title">Core Brief</div>
      ${textField('Project name', 'core.project_name', 'Q3 launch, rebrand announcement…')}
      <div class="field-row">
        ${textField('Primary objective', 'core.objective.primary', 'What must this achieve?')}
        ${textField('Secondary objective', 'core.objective.secondary', 'Optional')}
      </div>
      ${textField('Success metric / KPI', 'core.success_metric_kpi', 'How will you know it worked?')}
      <div class="field-row">
        ${textField('Primary audience', 'core.audience.primary', 'Who is this for?')}
        ${textField('Secondary audience', 'core.audience.secondary', 'Optional')}
      </div>
      ${selectField('Audience awareness level', 'core.audience_awareness_level', AWARENESS_LEVELS)}
      ${textField('Key message — the single truth', 'core.key_message_single_truth', 'If they remember one thing, it is…', true)}
      ${tagField('Proof points / reasons to believe', 'core.proof_points_reasons_to_believe')}
    </div>

    <div class="section">
      <div class="section-title">Constraints</div>
      ${textField('Timeline', 'core.constraints.timeline', 'Deadlines, key dates')}
      ${chipField('Channels', 'core.constraints.channels', CHANNEL_OPTIONS)}
      ${chipField('Tone', 'core.constraints.tone', TONE_OPTIONS)}
      ${tagField('Must include', 'core.constraints.must_include')}
      ${tagField('Must avoid', 'core.constraints.must_avoid')}
    </div>
  `;
}

function renderMarketingModule() {
  return `
    <div class="section">
      <div class="section-title">Marketing Module</div>

      <div class="subsection">
        <div class="subsection-title">Planning context</div>
        <div class="field-row">
          ${textField('Campaign type', 'marketing.planning_context.campaign_type', 'Launch, always-on, seasonal…')}
          ${textField('Seasonality', 'marketing.planning_context.seasonality', 'Timing dependencies')}
        </div>
        <div class="field-row">
          ${selectField('Funnel stage', 'marketing.planning_context.funnel_stage', FUNNEL_STAGES)}
          ${textField('Offer type', 'marketing.planning_context.offer_type', 'Discount, trial, content…')}
        </div>
        <div class="field-row">
          ${textField('Primary CTA', 'marketing.planning_context.cta.primary', 'The one action')}
          ${textField('Secondary CTA', 'marketing.planning_context.cta.secondary', 'Optional')}
        </div>
      </div>

      <div class="subsection">
        <div class="subsection-title">Audience depth</div>
        ${textField('Job to be done', 'marketing.audience_depth.job_to_be_done', 'What is the audience trying to accomplish?', true)}
        ${tagField('Pain points', 'marketing.audience_depth.pain_points')}
        ${tagField('Objections', 'marketing.audience_depth.objections')}
        ${tagField('Motivators', 'marketing.audience_depth.motivators')}
      </div>

      <div class="subsection">
        <div class="subsection-title">Channels</div>
        <div class="field-row">
          ${textField('Primary channel', 'marketing.channels.primary_channel')}
          ${textField('Channel role', 'marketing.channels.channel_role', 'Reach, convert, nurture…')}
        </div>
        ${tagField('Supporting channels', 'marketing.channels.supporting_channels')}
        ${textField('Media type', 'marketing.channels.media_type', 'Owned, earned, paid')}
      </div>

      <div class="subsection">
        <div class="subsection-title">Brand &amp; market</div>
        ${textField('Brand positioning reminder', 'marketing.brand_market.brand_positioning_reminder', 'One line on where the brand stands', true)}
        ${tagField('Competitive set', 'marketing.brand_market.competitive_set')}
        ${textField('Differentiation angle', 'marketing.brand_market.differentiation_angle', 'Why us, in this campaign')}
        ${textField('Compliance / legal flags', 'marketing.brand_market.compliance_legal_flags', 'Claims to avoid, review requirements')}
      </div>
    </div>
  `;
}

const MODULE_RENDERERS = {
  marketing: renderMarketingModule
};

// ============================================
// OUTPUT RENDERERS
// ============================================

function renderBriefReadable() {
  const b = getOutputBrief();
  const c = b.core;

  const listOrDash = (arr) => arr && arr.length
    ? `<div class="tag-list">${arr.map(t => `<span class="tag-item">${escapeHtml(t)}</span>`).join('')}</div>`
    : '<p>—</p>';
  const textOrDash = (v) => `<p>${v ? escapeHtml(v) : '—'}</p>`;

  let html = `
    <h3>Project</h3>${textOrDash(c.project_name)}
    <h3>Objective</h3>${textOrDash([c.objective.primary, c.objective.secondary].filter(Boolean).join(' · '))}
    <h3>Success metric</h3>${textOrDash(c.success_metric_kpi)}
    <h3>Audience</h3>${textOrDash([c.audience.primary, c.audience.secondary].filter(Boolean).join(' · '))}
    <h3>Awareness level</h3>${textOrDash(c.audience_awareness_level)}
    <h3>Key message</h3>${textOrDash(c.key_message_single_truth)}
    <h3>Proof points</h3>${listOrDash(c.proof_points_reasons_to_believe)}
    <h3>Timeline</h3>${textOrDash(c.constraints.timeline)}
    <h3>Channels</h3>${listOrDash(c.constraints.channels)}
    <h3>Tone</h3>${listOrDash(c.constraints.tone)}
    <h3>Must include</h3>${listOrDash(c.constraints.must_include)}
    <h3>Must avoid</h3>${listOrDash(c.constraints.must_avoid)}
  `;

  if (b.marketing) {
    const m = b.marketing;
    html += `
      <h3>Campaign type · funnel</h3>${textOrDash([m.planning_context.campaign_type, m.planning_context.funnel_stage].filter(Boolean).join(' · '))}
      <h3>CTA</h3>${textOrDash([m.planning_context.cta.primary, m.planning_context.cta.secondary].filter(Boolean).join(' · '))}
      <h3>Job to be done</h3>${textOrDash(m.audience_depth.job_to_be_done)}
      <h3>Pain points</h3>${listOrDash(m.audience_depth.pain_points)}
      <h3>Objections</h3>${listOrDash(m.audience_depth.objections)}
      <h3>Motivators</h3>${listOrDash(m.audience_depth.motivators)}
      <h3>Primary channel</h3>${textOrDash(m.channels.primary_channel)}
      <h3>Supporting channels</h3>${listOrDash(m.channels.supporting_channels)}
      <h3>Positioning</h3>${textOrDash(m.brand_market.brand_positioning_reminder)}
      <h3>Competitive set</h3>${listOrDash(m.brand_market.competitive_set)}
      <h3>Differentiation</h3>${textOrDash(m.brand_market.differentiation_angle)}
      <h3>Compliance flags</h3>${textOrDash(m.brand_market.compliance_legal_flags)}
    `;
  }

  return `<div class="output-brief">${html}</div>`;
}

function renderBriefPlainText() {
  const b = getOutputBrief();
  const lines = [];
  const walk = (obj, prefix = '') => {
    for (const [key, value] of Object.entries(obj)) {
      const label = (prefix + key).replace(/_/g, ' ').replace(/\./g, ' › ');
      if (Array.isArray(value)) {
        if (value.length) lines.push(`${label}: ${value.join(', ')}`);
      } else if (typeof value === 'object' && value !== null) {
        walk(value, prefix + key + '.');
      } else if (value) {
        lines.push(`${label}: ${value}`);
      }
    }
  };
  walk(b);
  return lines.join('\n');
}

function renderBriefJSON() {
  return `<pre class="output-json">${escapeHtml(JSON.stringify(getOutputBrief(), null, 2))}</pre>`;
}

// ============================================
// MAIN RENDER
// ============================================

function render() {
  const root = document.getElementById('root');

  root.innerHTML = `
    <div class="masthead">
      <div class="eyebrow">Editorial OS</div>
      <h1>Brief Engine</h1>
      <div class="dek">Structured briefs that power every downstream workflow.</div>
    </div>

    <div class="container">
      <div class="section">
        <div class="section-title">Modules</div>
        <div class="mode-toggles">
          ${MODULES.map(mod => `
            <label class="mode-toggle ${state.activeModules.includes(mod.id) ? 'active' : ''}">
              <input type="checkbox" data-module="${mod.id}" ${state.activeModules.includes(mod.id) ? 'checked' : ''}>
              ${mod.label}
            </label>
          `).join('')}
        </div>
      </div>

      ${renderCoreModule()}

      ${state.activeModules.map(id => MODULE_RENDERERS[id] ? MODULE_RENDERERS[id]() : '').join('')}

      <div class="output-panel">
        <div class="output-tabs">
          <button class="output-tab ${state.outputTab === 'brief' ? 'active' : ''}" data-output-tab="brief">Brief</button>
          <button class="output-tab ${state.outputTab === 'json' ? 'active' : ''}" data-output-tab="json">JSON</button>
        </div>
        <div class="output-content">
          ${state.outputTab === 'brief' ? renderBriefReadable() : renderBriefJSON()}
        </div>
        <div class="output-actions">
          <button class="action-btn" id="copy-brief-btn">Copy brief</button>
          <button class="action-btn" id="copy-json-btn">Copy JSON</button>
          <button class="action-btn primary" id="download-json-btn">Download JSON</button>
          <button class="action-btn" id="reset-btn" title="Clear the draft and start over">New brief</button>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="footer-text">Editorial OS · Runs entirely on your device — no network, no data collection</div>
    </div>
  `;

  attachEventListeners();
}

// ============================================
// EVENTS
// ============================================

function attachEventListeners() {
  // Text inputs and textareas bound by data-path
  document.querySelectorAll('input[data-path], textarea[data-path], select[data-path]').forEach(el => {
    const evt = el.tagName === 'SELECT' ? 'change' : 'input';
    el.addEventListener(evt, (e) => {
      setByPath(state.brief, e.target.dataset.path, e.target.value);
      saveDraft();
      refreshOutput();
    });
  });

  // Tag inputs: Enter adds a tag
  document.querySelectorAll('.tag-input[data-tag-path]').forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addTag(e.target.dataset.tagPath, e.target.value);
      }
    });
  });

  // Tag remove buttons
  document.querySelectorAll('.tag-remove[data-tag-remove]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      removeTag(e.target.dataset.tagRemove, parseInt(e.target.dataset.tagIndex));
    });
  });

  // Chips
  document.querySelectorAll('.chip[data-chip-path]').forEach(chip => {
    chip.addEventListener('click', (e) => {
      const el = e.target.closest('.chip');
      toggleChip(el.dataset.chipPath, el.dataset.chipValue);
    });
  });

  // Module toggles
  document.querySelectorAll('.mode-toggle input[data-module]').forEach(input => {
    input.addEventListener('change', (e) => toggleModule(e.target.dataset.module));
  });

  // Output tabs
  document.querySelectorAll('.output-tab[data-output-tab]').forEach(tab => {
    tab.addEventListener('click', (e) => {
      state.outputTab = e.target.dataset.outputTab;
      render();
    });
  });

  // Output actions — addEventListener only; inline handlers are blocked by MV3 CSP
  const copyBriefBtn = document.getElementById('copy-brief-btn');
  if (copyBriefBtn) copyBriefBtn.addEventListener('click', (e) => copyBriefText(e.target));

  const copyJsonBtn = document.getElementById('copy-json-btn');
  if (copyJsonBtn) copyJsonBtn.addEventListener('click', (e) => copyJSON(e.target));

  const downloadBtn = document.getElementById('download-json-btn');
  if (downloadBtn) downloadBtn.addEventListener('click', downloadJSON);

  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) resetBtn.addEventListener('click', resetBrief);
}

// Update only the output panel content without a full re-render,
// so typing in a field doesn't steal focus.
function refreshOutput() {
  const content = document.querySelector('.output-content');
  if (content) {
    content.innerHTML = state.outputTab === 'brief' ? renderBriefReadable() : renderBriefJSON();
  }
}

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  loadDraft(render);
});
