(function () {
  'use strict';

  const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  const TEAMS = {
    claude: {
      id: 'claude',
      name: 'Claude Team',
      brandIcon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z"/></svg>',
      brandLabel: 'ANTHROPIC RELEASES',
      prefix: 'claude_team',
      themeClass: '',
      categories: {
        'claude-code': 'Claude Code',
        'claude-ai': 'Claude.ai',
        'api': 'API / Models',
        'desktop': 'Desktop',
        'other': 'Other'
      },
      categoryColors: {
        'claude-code': 'cat-claude-code',
        'claude-ai': 'cat-claude-ai',
        'api': 'cat-api',
        'desktop': 'cat-desktop',
        'other': 'cat-other'
      }
    },
    openai: {
      id: 'openai',
      name: 'OpenAI',
      brandIcon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.998 5.998 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/></svg>',
      brandLabel: 'OPENAI RELEASES',
      prefix: 'openai_team',
      themeClass: 'theme-openai',
      categories: {
        'codex': 'Codex',
        'chatgpt': 'ChatGPT',
        'api': 'API / Models',
        'desktop': 'Desktop',
        'other': 'Other'
      },
      categoryColors: {
        'codex': 'cat-codex',
        'chatgpt': 'cat-chatgpt',
        'api': 'cat-api',
        'desktop': 'cat-desktop',
        'other': 'cat-other'
      }
    }
  };

  const state = {
    activeTeam: null,
    data: null,
    bounds: null,
    range: null,
    monthCursor: null
  };

  const tooltip = document.getElementById('tooltip');
  const calendar = document.getElementById('calendar');
  const trackedPeople = document.getElementById('tracked-people');
  const startInput = document.getElementById('start-date');
  const endInput = document.getElementById('end-date');
  const prevMonthButton = document.getElementById('prev-month');
  const nextMonthButton = document.getElementById('next-month');
  const currentMonthButton = document.getElementById('current-month-button');

  // --- Data loading ---

  async function loadJson(path) {
    const resp = await fetch(path);
    if (!resp.ok) {
      throw new Error(`Failed to load ${path}: HTTP ${resp.status}`);
    }
    return resp.json();
  }

  async function loadData(team) {
    const [releaseData, trackedAccounts] = await Promise.all([
      loadJson(`data/${team.prefix}_releases.json`),
      loadJson(`data/${team.prefix}_tracked_accounts.json`).catch(() => null)
    ]);

    const normalizedAccounts = Array.isArray(trackedAccounts)
      ? trackedAccounts
      : Array.isArray(trackedAccounts?.trackedAccounts)
        ? trackedAccounts.trackedAccounts
        : releaseData.meta?.trackedAccounts || [];

    return {
      ...releaseData,
      trackedAccounts: normalizedAccounts
    };
  }

  // --- Date utilities ---

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

    return `${startText} \u2014 ${endText}`;
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

    return `${formatMonthLabel(range.start)} \u2014 ${formatMonthLabel(range.end)}`;
  }

  function getVisibleRangeCaption(range) {
    if (isFullMonthRange(range)) {
      return 'Monthly view';
    }

    return `Custom range \u00b7 ${formatRangeLabel(range.start, range.end)}`;
  }

  // --- Computation ---

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

  // --- Rendering helpers ---

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

  // --- Render functions ---

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

  function renderBranding() {
    const team = state.activeTeam;
    document.getElementById('brand-icon').innerHTML = team.brandIcon;
    document.getElementById('brand-label').textContent = team.brandLabel;
    document.getElementById('team-name').textContent = team.name;
  }

  // --- Feature pills ---

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

    const team = state.activeTeam;
    const dot = document.createElement('span');
    dot.className = `feature-dot ${team.categoryColors[feature.category] || 'cat-other'}`;
    return dot;
  }

  function showTooltip(event, feature) {
    const handle = feature.announcer || extractHandleFromTweetUrl(feature.tweetUrl);
    const announcer = handle ? `@${handle}` : 'Unknown author';
    const team = state.activeTeam;
    const category = team.categories[feature.category] || feature.category;
    const titleParts = [feature.icon || '', feature.name].filter(Boolean);
    const hint = feature.tweetUrl ? 'Opens original tweet' : 'Tweet link unavailable';

    tooltip.innerHTML = `
      <div class="tooltip-title">${escapeHtml(titleParts.join(' '))}</div>
      <div class="tooltip-meta">${escapeHtml(category)} \u00b7 ${escapeHtml(announcer)}</div>
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

  // --- Calendar rendering ---

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

  // --- State management ---

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

  // --- Team switching ---

  async function switchTeam(teamId) {
    const team = TEAMS[teamId];
    if (!team) return;

    state.activeTeam = team;
    document.body.className = team.themeClass;

    // Update branding
    renderBranding();

    // Update switcher active state
    document.querySelectorAll('.team-tab').forEach(function (tab) {
      tab.classList.toggle('active', tab.dataset.team === teamId);
    });

    // Update URL hash without scrolling
    history.replaceState(null, '', `#${teamId}`);

    // Load team data
    const data = await loadData(team);
    state.data = data;
    state.bounds = computeBounds(data);

    renderTrackedPeople(data.trackedAccounts || []);
    setRangeToMonth(normalizeDate(new Date()));
  }

  // --- Controls ---

  function bindControls() {
    prevMonthButton.addEventListener('click', function () {
      setRangeToMonth(addMonths(state.monthCursor, -1));
    });

    nextMonthButton.addEventListener('click', function () {
      setRangeToMonth(addMonths(state.monthCursor, 1));
    });

    currentMonthButton.addEventListener('click', function () {
      setRangeToMonth(normalizeDate(new Date()));
    });

    startInput.addEventListener('change', function () {
      if (!startInput.value) return;

      const nextStart = parseDate(startInput.value);
      const nextEnd = endInput.value ? parseDate(endInput.value) : nextStart;
      setRange(nextStart, nextEnd);
    });

    endInput.addEventListener('change', function () {
      if (!endInput.value) return;

      const nextEnd = parseDate(endInput.value);
      const nextStart = startInput.value ? parseDate(startInput.value) : nextEnd;
      setRange(nextStart, nextEnd);
    });

    // Team switcher
    document.querySelectorAll('.team-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        const teamId = this.dataset.team;
        if (state.activeTeam && state.activeTeam.id === teamId) return;
        switchTeam(teamId);
      });
    });

    // Hash change
    window.addEventListener('hashchange', function () {
      const hash = location.hash.replace('#', '');
      if (TEAMS[hash] && state.activeTeam.id !== hash) {
        switchTeam(hash);
      }
    });
  }

  // --- Init ---

  async function init() {
    try {
      // Determine initial team from URL hash
      const hash = location.hash.replace('#', '');
      const initialTeamId = TEAMS[hash] ? hash : 'claude';

      bindControls();
      await switchTeam(initialTeamId);
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
