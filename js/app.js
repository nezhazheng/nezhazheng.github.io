(function () {
  'use strict';

  const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  const CATEGORY_COLORS = {
    'claude-code': 'cat-claude-code',
    'claude-ai': 'cat-claude-ai',
    'api': 'cat-api',
    'desktop': 'cat-desktop',
    'other': 'cat-other'
  };

  const CATEGORY_LABELS = {
    'claude-code': 'Claude Code',
    'claude-ai': 'Claude.ai',
    'api': 'API / Models',
    'desktop': 'Desktop',
    'other': 'Other'
  };

  // --- Data loading ---

  async function loadData() {
    const resp = await fetch('data/releases.json');
    return resp.json();
  }

  // --- Utility ---

  function formatDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function parseDate(s) {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  function daysBetween(a, b) {
    const msPerDay = 86400000;
    return Math.floor((b - a) / msPerDay) + 1;
  }

  // ISO weekday: Mon=0 ... Sun=6
  function isoWeekday(date) {
    const d = date.getDay();
    return d === 0 ? 6 : d - 1;
  }

  function getMonthRange(startDate, endDate) {
    const months = [];
    const cur = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
    while (cur <= end) {
      months.push({ year: cur.getFullYear(), month: cur.getMonth() });
      cur.setMonth(cur.getMonth() + 1);
    }
    return months;
  }

  function monthName(monthIdx) {
    return ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'][monthIdx];
  }

  function daysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  // --- Build lookup ---

  function buildReleaseLookup(releases) {
    const map = new Map();
    for (const entry of releases) {
      map.set(entry.date, entry.features);
    }
    return map;
  }

  // --- Compute stats ---

  function computeStats(data) {
    const startDate = parseDate(data.meta.startDate);
    const releases = data.releases;

    // Find the last release date
    let lastReleaseDate = startDate;
    for (const r of releases) {
      const d = parseDate(r.date);
      if (d > lastReleaseDate) lastReleaseDate = d;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = lastReleaseDate > today ? lastReleaseDate : today;

    const days = daysBetween(startDate, endDate);
    let totalFeatures = 0;
    let daysWithReleases = 0;
    for (const r of releases) {
      totalFeatures += r.features.length;
      daysWithReleases++;
    }

    return { days, totalFeatures, daysWithReleases, startDate, endDate };
  }

  // --- Render header ---

  function renderHeader(data, stats) {
    document.getElementById('day-count').textContent = stats.days;

    const startStr = stats.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = stats.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    document.getElementById('date-range').textContent = `${startStr} — ${endStr}`;
  }

  // --- Render stats bar ---

  function renderStatsBar(stats) {
    const header = document.querySelector('header');
    const bar = document.createElement('div');
    bar.className = 'stats-bar';
    bar.innerHTML = `
      <div class="stat-item">
        <div class="stat-value">${stats.totalFeatures}</div>
        <div class="stat-label">Releases</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${stats.days}</div>
        <div class="stat-label">Days</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${stats.daysWithReleases}</div>
        <div class="stat-label">Active Days</div>
      </div>
    `;
    header.after(bar);
  }

  // --- Render tracked people ---

  function renderTrackedPeople(accounts) {
    const container = document.getElementById('tracked-people');
    for (const acc of accounts) {
      const person = document.createElement('div');
      person.className = 'person';

      const img = document.createElement('img');
      img.className = 'person-avatar';
      img.src = `https://unavatar.io/x/${acc.handle}`;
      img.alt = acc.name;
      img.loading = 'lazy';
      img.onerror = function () {
        const fallback = document.createElement('div');
        fallback.className = 'person-avatar-fallback';
        fallback.textContent = acc.name.charAt(0).toUpperCase();
        this.replaceWith(fallback);
      };

      const info = document.createElement('div');
      info.className = 'person-info';
      info.innerHTML = `
        <span class="person-name">${acc.name}</span>
        <span class="person-handle">@${acc.handle}</span>
      `;

      person.appendChild(img);
      person.appendChild(info);
      container.appendChild(person);
    }
  }

  // --- Render legend ---

  function renderLegend() {
    const statsBar = document.querySelector('.stats-bar');
    const legend = document.createElement('div');
    legend.className = 'legend';
    for (const [cat, label] of Object.entries(CATEGORY_LABELS)) {
      const item = document.createElement('div');
      item.className = 'legend-item';
      item.innerHTML = `<span class="legend-dot ${CATEGORY_COLORS[cat]}"></span>${label}`;
      legend.appendChild(item);
    }
    statsBar.after(legend);
  }

  // --- Render calendar ---

  function renderCalendar(data, stats) {
    const calendar = document.getElementById('calendar');
    const lookup = buildReleaseLookup(data.releases);
    const months = getMonthRange(stats.startDate, stats.endDate);
    const todayStr = formatDate(new Date());

    for (const { year, month } of months) {
      const block = document.createElement('div');
      block.className = 'month-block';

      // Month label
      const label = document.createElement('div');
      label.className = 'month-label';
      label.textContent = monthName(month).toUpperCase();
      block.appendChild(label);

      // Weekday headers
      const weekHeader = document.createElement('div');
      weekHeader.className = 'weekday-header';
      for (const wd of WEEKDAYS) {
        const span = document.createElement('span');
        span.textContent = wd;
        weekHeader.appendChild(span);
      }
      block.appendChild(weekHeader);

      // Grid
      const grid = document.createElement('div');
      grid.className = 'month-grid';

      const firstDay = new Date(year, month, 1);
      const startPad = isoWeekday(firstDay);
      const totalDays = daysInMonth(year, month);

      // Empty cells before first day
      for (let i = 0; i < startPad; i++) {
        const empty = document.createElement('div');
        empty.className = 'day-cell empty';
        grid.appendChild(empty);
      }

      // Day cells
      for (let d = 1; d <= totalDays; d++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const features = lookup.get(dateStr);

        const cell = document.createElement('div');
        cell.className = 'day-cell';
        if (features && features.length > 0) cell.classList.add('has-releases');
        if (dateStr === todayStr) cell.classList.add('today');

        const num = document.createElement('div');
        num.className = 'day-number';
        num.textContent = d;
        cell.appendChild(num);

        if (features && features.length > 0) {
          const list = document.createElement('div');
          list.className = 'features-list';

          for (const feat of features) {
            const pill = document.createElement('a');
            pill.className = 'feature-pill';
            if (feat.tweetUrl) {
              pill.href = feat.tweetUrl;
              pill.target = '_blank';
              pill.rel = 'noopener';
            }

            const catClass = CATEGORY_COLORS[feat.category] || 'cat-other';

            pill.innerHTML = `
              <span class="feature-dot ${catClass}"></span>
              <span class="feature-name">${escapeHtml(feat.name)}</span>
            `;

            // Tooltip
            pill.addEventListener('mouseenter', (e) => showTooltip(e, feat));
            pill.addEventListener('mouseleave', hideTooltip);

            list.appendChild(pill);
          }

          cell.appendChild(list);
        }

        grid.appendChild(cell);
      }

      block.appendChild(grid);
      calendar.appendChild(block);
    }
  }

  // --- Tooltip ---

  const tooltip = document.getElementById('tooltip');

  function showTooltip(e, feat) {
    const announcer = feat.announcer ? `@${feat.announcer}` : '';
    const category = CATEGORY_LABELS[feat.category] || feat.category;

    tooltip.innerHTML = `
      <div class="tooltip-title">${feat.icon || ''} ${escapeHtml(feat.name)}</div>
      <div class="tooltip-meta">${category}${announcer ? ' &middot; ' + announcer : ''}</div>
    `;
    tooltip.classList.add('visible');
    positionTooltip(e);
  }

  function hideTooltip() {
    tooltip.classList.remove('visible');
  }

  function positionTooltip(e) {
    const rect = tooltip.getBoundingClientRect();
    let x = e.clientX + 12;
    let y = e.clientY + 12;

    if (x + rect.width > window.innerWidth - 10) {
      x = e.clientX - rect.width - 12;
    }
    if (y + rect.height > window.innerHeight - 10) {
      y = e.clientY - rect.height - 12;
    }

    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
  }

  // --- Helpers ---

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // --- Init ---

  async function init() {
    try {
      const data = await loadData();
      const stats = computeStats(data);

      renderHeader(data, stats);
      renderStatsBar(stats);
      renderTrackedPeople(data.meta.trackedAccounts);
      renderLegend();
      renderCalendar(data, stats);
    } catch (err) {
      console.error('Failed to load release data:', err);
      document.getElementById('calendar').innerHTML =
        '<p style="text-align:center;color:var(--text-secondary);padding:2rem;">Failed to load data. Please try again later.</p>';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
