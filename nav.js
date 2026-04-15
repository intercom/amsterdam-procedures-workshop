// nav.js
const STAGES = [
  { file: 'index.html',                    title: 'Overview' },
  { file: 'stage-1-welcome.html',          title: 'Welcome & Overview' },
  { file: 'stage-2-exploration.html',      title: 'Exploration: Map Your SOP' },
  { file: 'stage-3-translate.html',        title: 'Translate to a Fin Procedure' },
  { file: 'stage-4-connectors.html',       title: 'Data Connectors' },
  { file: 'stage-5-build.html',            title: 'Build the Procedure' },
  { file: 'stage-6-simulate.html',         title: 'Simulate & Stress Test' },
  { file: 'stage-7-internal-agent.html',   title: 'Advanced: Internal Agent' },
  { file: 'stage-8-own-use-cases.html',    title: 'Your Own Use Cases' },
];

function currentIndex() {
  const file = window.location.pathname.split('/').pop() || 'index.html';
  return STAGES.findIndex(s => s.file === file);
}

function renderNav(containerId) {
  const idx = currentIndex();
  const container = document.getElementById(containerId);
  if (!container) return;

  const prev = idx > 0 ? STAGES[idx - 1] : null;
  const next = idx < STAGES.length - 1 ? STAGES[idx + 1] : null;

  container.innerHTML = `
    ${prev
      ? `<a href="${prev.file}" class="nav-btn nav-btn--prev">← ${prev.title}</a>`
      : `<span class="nav-btn nav-btn--ghost"></span>`}
    ${next
      ? `<a href="${next.file}" class="nav-btn nav-btn--next">${next.title} →</a>`
      : `<span class="nav-btn nav-btn--ghost"></span>`}
  `;
}

function renderProgress(fillId) {
  const idx = currentIndex();
  if (idx < 1) return;
  const fill = document.getElementById(fillId);
  if (!fill) return;
  const pct = Math.round(((idx) / (STAGES.length - 1)) * 100);
  fill.style.width = pct + '%';
}

function renderStageIndicator(elemId) {
  const idx = currentIndex();
  if (idx < 1) return;
  const el = document.getElementById(elemId);
  if (!el) return;
  el.textContent = `Stage ${idx} of ${STAGES.length - 1}`;
}

function renderSidebar(containerId) {
  const idx = currentIndex();
  const sidebar = document.getElementById(containerId);
  if (!sidebar) return;

  const collapsed = localStorage.getItem('sidebar-collapsed') === 'true';
  if (collapsed) sidebar.classList.add('sidebar--collapsed');

  const items = STAGES.map((s, i) => {
    const num = i === 0 ? '◆' : i;
    const active = i === idx ? ' active' : '';
    return `<a href="${s.file}" class="sidebar-item${active}" title="${s.title}">
      <span class="sidebar-num">${num}</span>
      <span class="sidebar-label">${s.title}</span>
    </a>`;
  }).join('');

  sidebar.innerHTML = `
    <div class="sidebar-header">
      <span class="sidebar-header-text">Stages</span>
    </div>
    <nav class="sidebar-nav">${items}</nav>
    <button class="sidebar-toggle" onclick="toggleSidebar()" title="Collapse sidebar">
      <span class="sidebar-toggle-icon">${collapsed ? '›' : '‹'}</span>
    </button>
  `;
}

function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;
  const willCollapse = !sidebar.classList.contains('sidebar--collapsed');
  sidebar.classList.toggle('sidebar--collapsed', willCollapse);
  localStorage.setItem('sidebar-collapsed', willCollapse);
  const icon = sidebar.querySelector('.sidebar-toggle-icon');
  if (icon) icon.textContent = willCollapse ? '›' : '‹';
}
