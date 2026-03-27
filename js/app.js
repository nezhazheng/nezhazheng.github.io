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

  const state = {
    data: null,
    bounds: null,
    range: null,
    monthCursor: null
  };

  const tooltip = document.getElementById('tooltip');
  const calendar = document.getElementById('calendar');
  const trackedPeople = document.getElementById('tracked-people');
  const legend = document.getElementById('legend');
  const startInput = document.getElementById('start-date');
  const endInput = document.getElementById('end-date');
  const prevMonthButton = document.getElementById('prev-month');
  const nextMonthButton = document.getElementById('next-month');
  const currentMonthButton = document.getElementById('current-month-button');

  async function loadData() {
    const resp = await fetch('data/releases.json');
    return resp.json();
  }

  function normalizeDate(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function parseDate(value) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  function endOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  function addMonths(date, delta) {
    return new Date(date.getFullYear(), date.getMonth() + delta, 1);
  }

  function daysBetween(startDate, endDate) {
    const msPerDay = 86400000;
    return Math.floor((endDate - startDate) / msPerDay) + 1;
  }

  function sameMonth(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
  }

  function datesEqual(a, b) {
    return a.getTime() === b.getTime();
  }

  function clampDate(date, minDate, maxDate) {
    if (date < minDate) return new Date(minDate);
    if (date > maxDate) return new Date(maxDate);
    return new Date(date);
  }

  function clampMonth(date, minDate, maxDate) {
    const month = startOfMonth(date);
    const minMonth = startOfMonth(minDate);
    const maxMonth = startOfMonth(maxDate);

    if (month < minMonth) return minMonth;
    if (month > maxMonth) return maxMonth;
    return month;
  }

  function isWithinRange(date, startDate, endDate) {
    return date >= startDate && date <= endDate;
  }

  function monthName(monthIdx) {
    return [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ][monthIdx];
  }

  function daysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  function isoWeekday(date) {
    const day = date.getDay();
    return day === 0 ? 6 : day - 1;
  }

  function getMonthRange(startDate, endDate) {
    const months = [];
    const cursor = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const last = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

    while (cursor <= last) {
      months.push({ year: cursor.getFullYear(), month: cursor.getMonth() });
      cursor.setMonth(cursor.getMonth() + 1);
    }

    return months;
  }

  function formatRangeLabel(startDate, endDate) {
    const startText = startDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    const endText = endDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    return `${startText} — ${endText}`;
  }

  function formatMonthLabel(date) {
    return `${monthName(date.getMonth())} ${date.getFullYear()}`;
  }

  function isFullMonthRange(range) {
    return sameMonth(range.start, range.end) &&
      datesEqual(range.start, startOfMonth(range.start)) &&
      datesEqual(range.end, endOfMonth(range.start));
  }

  function getVisibleRangeTitle(range) {
    if (sameMonth(range.start, range.end)) {
      return formatMonthLabel(range.start);
    }

    return `${formatMonthLabel(range.start)} — ${formatMonthLabel(range.end)}`;
  }

  function getVisibleRangeCaption(range) {
    if (isFullMonthRange(range)) {
      return 'Monthly view';
    }

    return `Custom range · ${formatRangeLabel(range.start, range.end)}`;
  }

  function computeBounds(data) {
    const startDate = startOfMonth(parseDate(data.meta.startDate));
    let latestReleaseDate = parseDate(data.meta.startDate);

    for (const release of data.releases) {
      const releaseDate = parseDate(release.date);
      if (releaseDate > latestReleaseDate) {
        latestReleaseDate = releaseDate;
      }
    }

    const today = normalizeDate(new Date());
    const upperBoundSource = latestReleaseDate > today ? latestReleaseDate : today;

    return {
      min: startDate,
      max: endOfMonth(upperBoundSource)
    };
  }

  function escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = value;
    return div.innerHTML;
  }

  function computeStats(data, range) {
    let totalFeatures = 0;
    let daysWithReleases = 0;

    for (const release of data.releases) {
      const releaseDate = parseDate(release.date);
      if (!isWithinRange(releaseDate, range.start, range.end)) {
        continue;
      }

      totalFeatures += release.features.length;
      if (release.features.length > 0) {
        daysWithReleases += 1;
      }
    }

    return {
      days: daysBetween(range.start, range.end),
      totalFeatures,
      daysWithReleases,
      startDate: range.start,
      endDate: range.end
    };
  }

  function buildReleaseLookup(releases, startDate, endDate) {
    const map = new Map();

    for (const release of releases) {
      const releaseDate = parseDate(release.date);
      if (isWithinRange(releaseDate, startDate, endDate)) {
        map.set(release.date, release.features);
      }
    }

    return map;
  }

  function extractHandleFromTweetUrl(tweetUrl) {
    if (!tweetUrl) return '';

    const match = tweetUrl.match(/(?:x\.com|twitter\.com)\/([^/]+)\/status\//i);
    return match ? match[1] : '';
  }

  function createFallbackBadge(text, className) {
    const badge = document.createElement('div');
    badge.className = className;
    badge.textContent = (text || '?').charAt(0).toUpperCase();
    return badge;
  }

  function createAvatar(handle, imageClass, fallbackClass, fallbackText, altText) {
    const image = document.createElement('img');
    image.className = imageClass;
    image.src = `https://unavatar.io/x/${handle}`;
    image.alt = altText;
    image.loading = 'lazy';
    image.onerror = function () {
      this.replaceWith(createFallbackBadge(fallbackText, fallbackClass));
    };
    return image;
  }

  function renderHeader(stats) {
    document.getElementById('day-count').textContent = stats.days;
    document.getElementById('date-range').textContent = formatRangeLabel(stats.startDate, stats.endDate);
  }

  function renderStatsBar(stats) {
    document.getElementById('stat-releases').textContent = stats.totalFeatures;
    document.getElementById('stat-days').textContent = stats.days;
    document.getElementById('stat-active-days').textContent = stats.daysWithReleases;
  }

  function renderTrackedPeople(accounts) {
    trackedPeople.textContent = '';

    for (const account of accounts) {
      const person = document.createElement('a');
      person.className = 'person';
      person.href = `https://x.com/${account.handle}`;
      person.target = '_blank';
      person.rel = 'noopener';
      person.setAttribute('aria-label', `Open @${account.handle} on X`);

      const avatar = createAvatar(
        account.handle,
        'person-avatar',
        'person-avatar-fallback',
        account.name,
        account.name
      );

      const info = document.createElement('div');
      info.className = 'person-info';

      const name = document.createElement('span');
      name.className = 'person-name';
      name.textContent = account.name;

      const handle = document.createElement('span');
      handle.className = 'person-handle';
      handle.textContent = `@${account.handle}`;

      info.appendChild(name);
      info.appendChild(handle);
      person.appendChild(avatar);
      person.appendChild(info);
      trackedPeople.appendChild(person);
    }
  }

  function renderLegend() {
    legend.textContent = '';

    for (const [category, label] of Object.entries(CATEGORY_LABELS)) {
      const item = document.createElement('div');
      item.className = 'legend-item';

      const dot = document.createElement('span');
      dot.className = `legend-dot ${CATEGORY_COLORS[category]}`;

      const text = document.createElement('span');
      text.textContent = label;

      item.appendChild(dot);
      item.appendChild(text);
      legend.appendChild(item);
    }
  }

  function renderToolbar() {
    startInput.min = formatDate(state.bounds.min);
    startInput.max = formatDate(state.bounds.max);
    endInput.min = formatDate(state.bounds.min);
    endInput.max = formatDate(state.bounds.max);
    startInput.value = formatDate(state.range.start);
    endInput.value = formatDate(state.range.end);

    document.getElementById('visible-month-label').textContent = getVisibleRangeTitle(state.range);
    document.getElementById('visible-month-caption').textContent = getVisibleRangeCaption(state.range);

    const minMonth = startOfMonth(state.bounds.min);
    const maxMonth = startOfMonth(state.bounds.max);

    prevMonthButton.disabled = datesEqual(state.monthCursor, minMonth);
    nextMonthButton.disabled = datesEqual(state.monthCursor, maxMonth);
  }

  function createFeatureMarker(feature) {
    const handle = feature.announcer || extractHandleFromTweetUrl(feature.tweetUrl);

    if (handle) {
      return createAvatar(
        handle,
        'feature-avatar',
        'feature-avatar-fallback',
        handle,
        `Avatar of @${handle}`
      );
    }

    const dot = document.createElement('span');
    dot.className = `feature-dot ${CATEGORY_COLORS[feature.category] || 'cat-other'}`;
    return dot;
  }

  function showTooltip(event, feature) {
    const handle = feature.announcer || extractHandleFromTweetUrl(feature.tweetUrl);
    const announcer = handle ? `@${handle}` : 'Unknown author';
    const category = CATEGORY_LABELS[feature.category] || feature.category;
    const titleParts = [feature.icon || '', feature.name].filter(Boolean);
    const hint = feature.tweetUrl ? 'Opens original tweet' : 'Tweet link unavailable';

    tooltip.innerHTML = `
      <div class="tooltip-title">${escapeHtml(titleParts.join(' '))}</div>
      <div class="tooltip-meta">${escapeHtml(category)} &middot; ${escapeHtml(announcer)}</div>
      <div class="tooltip-meta">${escapeHtml(hint)}</div>
    `;
    tooltip.classList.add('visible');
    positionTooltip(event);
  }

  function hideTooltip() {
    tooltip.classList.remove('visible');
  }

  function positionTooltip(event) {
    const rect = tooltip.getBoundingClientRect();
    let x = event.clientX + 12;
    let y = event.clientY + 12;

    if (x + rect.width > window.innerWidth - 10) {
      x = event.clientX - rect.width - 12;
    }
    if (y + rect.height > window.innerHeight - 10) {
      y = event.clientY - rect.height - 12;
    }

    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
  }

  function createFeaturePill(feature) {
    const pill = feature.tweetUrl ? document.createElement('a') : document.createElement('div');
    pill.className = 'feature-pill';

    if (feature.tweetUrl) {
      pill.href = feature.tweetUrl;
      pill.target = '_blank';
      pill.rel = 'noopener';
    } else {
      pill.classList.add('feature-pill-disabled');
    }

    pill.appendChild(createFeatureMarker(feature));

    const name = document.createElement('span');
    name.className = 'feature-name';
    name.textContent = feature.name;

    pill.appendChild(name);
    pill.addEventListener('mouseenter', (event) => showTooltip(event, feature));
    pill.addEventListener('mousemove', positionTooltip);
    pill.addEventListener('mouseleave', hideTooltip);

    return pill;
  }

  function createDayCell(cellDate, options = {}) {
    const { inRange = false, features = null, todayString = '', adjacentMonth = false } = options;
    const dateString = formatDate(cellDate);

    const cell = document.createElement('div');
    cell.className = 'day-cell';

    if (adjacentMonth) {
      cell.classList.add('adjacent-month', 'out-of-range');
    } else if (!inRange) {
      cell.classList.add('out-of-range');
    }

    if (!adjacentMonth && features && features.length > 0) cell.classList.add('has-releases');
    if (!adjacentMonth && inRange && dateString === todayString) cell.classList.add('today');

    const number = document.createElement('div');
    number.className = 'day-number';
    number.textContent = cellDate.getDate();
    cell.appendChild(number);

    if (!adjacentMonth && features && features.length > 0) {
      const list = document.createElement('div');
      list.className = 'features-list';

      for (const feature of features) {
        list.appendChild(createFeaturePill(feature));
      }

      cell.appendChild(list);
    }

    return cell;
  }

  function renderCalendar() {
    const lookup = buildReleaseLookup(state.data.releases, state.range.start, state.range.end);
    const months = getMonthRange(state.range.start, state.range.end);
    const today = normalizeDate(new Date());
    const todayString = formatDate(today);

    calendar.textContent = '';

    for (const { year, month } of months) {
      const block = document.createElement('div');
      block.className = 'month-block';

      const label = document.createElement('div');
      label.className = 'month-label';
      label.textContent = monthName(month).toUpperCase();
      block.appendChild(label);

      const weekHeader = document.createElement('div');
      weekHeader.className = 'weekday-header';
      for (const weekday of WEEKDAYS) {
        const span = document.createElement('span');
        span.textContent = weekday;
        weekHeader.appendChild(span);
      }
      block.appendChild(weekHeader);

      const grid = document.createElement('div');
      grid.className = 'month-grid';

      const firstDay = new Date(year, month, 1);
      const totalDays = daysInMonth(year, month);
      const startPad = isoWeekday(firstDay);
      const previousMonth = addMonths(firstDay, -1);
      const previousMonthTotalDays = daysInMonth(previousMonth.getFullYear(), previousMonth.getMonth());

      for (let i = 0; i < startPad; i++) {
        const dayNumber = previousMonthTotalDays - startPad + i + 1;
        const cellDate = new Date(previousMonth.getFullYear(), previousMonth.getMonth(), dayNumber);
        grid.appendChild(createDayCell(cellDate, { todayString, adjacentMonth: true }));
      }

      for (let day = 1; day <= totalDays; day++) {
        const cellDate = new Date(year, month, day);
        const inRange = isWithinRange(cellDate, state.range.start, state.range.end);
        const features = inRange ? lookup.get(formatDate(cellDate)) : null;
        grid.appendChild(createDayCell(cellDate, { inRange, features, todayString }));
      }

      const totalCells = startPad + totalDays;
      const endPad = (7 - (totalCells % 7)) % 7;
      const nextMonth = addMonths(firstDay, 1);

      for (let day = 1; day <= endPad; day++) {
        const cellDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), day);
        grid.appendChild(createDayCell(cellDate, { todayString, adjacentMonth: true }));
      }

      block.appendChild(grid);
      calendar.appendChild(block);
    }
  }

  function renderApp() {
    const stats = computeStats(state.data, state.range);
    renderHeader(stats);
    renderStatsBar(stats);
    renderToolbar();
    renderCalendar();
  }

  function setRange(startDate, endDate) {
    const safeStart = clampDate(normalizeDate(startDate), state.bounds.min, state.bounds.max);
    const safeEnd = clampDate(normalizeDate(endDate), state.bounds.min, state.bounds.max);

    state.range = safeStart <= safeEnd
      ? { start: safeStart, end: safeEnd }
      : { start: safeEnd, end: safeStart };

    state.monthCursor = startOfMonth(state.range.start);
    renderApp();
  }

  function setRangeToMonth(anchorDate) {
    const cursor = clampMonth(anchorDate, state.bounds.min, state.bounds.max);
    const rangeStart = startOfMonth(cursor);
    const rangeEnd = endOfMonth(cursor);

    state.monthCursor = cursor;
    state.range = { start: rangeStart, end: rangeEnd };
    renderApp();
  }

  function bindControls() {
    prevMonthButton.addEventListener('click', () => {
      setRangeToMonth(addMonths(state.monthCursor, -1));
    });

    nextMonthButton.addEventListener('click', () => {
      setRangeToMonth(addMonths(state.monthCursor, 1));
    });

    currentMonthButton.addEventListener('click', () => {
      setRangeToMonth(normalizeDate(new Date()));
    });

    startInput.addEventListener('change', () => {
      if (!startInput.value) return;

      const nextStart = parseDate(startInput.value);
      const nextEnd = endInput.value ? parseDate(endInput.value) : nextStart;
      setRange(nextStart, nextEnd);
    });

    endInput.addEventListener('change', () => {
      if (!endInput.value) return;

      const nextEnd = parseDate(endInput.value);
      const nextStart = startInput.value ? parseDate(startInput.value) : nextEnd;
      setRange(nextStart, nextEnd);
    });
  }

  async function init() {
    try {
      const data = await loadData();
      state.data = data;
      state.bounds = computeBounds(data);

      renderTrackedPeople(data.meta.trackedAccounts || []);
      renderLegend();
      bindControls();
      setRangeToMonth(normalizeDate(new Date()));
    } catch (error) {
      console.error('Failed to load release data:', error);
      calendar.innerHTML =
        '<p style="text-align:center;color:var(--text-secondary);padding:2rem;">Failed to load data. Please try again later.</p>';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
