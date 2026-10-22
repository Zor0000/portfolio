/* Public GitHub activity; no token or runtime dependency is needed. */
(() => {
  const section = document.querySelector('[data-github-user]');
  if (!section) return;

  const username = section.dataset.githubUser;
  const summary = section.querySelector('.github-summary');
  const calendar = section.querySelector('.github-calendar');
  const scrollHint = section.querySelector('.github-scroll-hint');
  const retry = section.querySelector('.github-retry');
  const endpoint = `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`;
  const cacheKey = `github-contributions:v1:${username}`;
  const cacheLifetime = 60 * 60 * 1000;
  const dayLength = 24 * 60 * 60 * 1000;
  const svgNamespace = 'http://www.w3.org/2000/svg';
  const dateFormat = new Intl.DateTimeFormat('en', {
    month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  });
  const numberFormat = new Intl.NumberFormat('en');

  function validate(data) {
    const days = data?.contributions;
    if (!Number.isSafeInteger(data?.total?.lastYear) || data.total.lastYear < 0 ||
        !Array.isArray(days) || days.length < 350 || days.length > 371) {
      throw new Error('Invalid contribution calendar');
    }
    let previousDate;
    for (const day of days) {
      const timestamp = Date.parse(`${day.date}T00:00:00Z`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(day.date) || !Number.isFinite(timestamp) ||
          new Date(timestamp).toISOString().slice(0, 10) !== day.date ||
          !Number.isSafeInteger(day.count) || day.count < 0 ||
          !Number.isInteger(day.level) || day.level < 0 || day.level > 4 ||
          (previousDate !== undefined && timestamp - previousDate !== dayLength)) {
        throw new Error('Invalid contribution day');
      }
      previousDate = timestamp;
    }
    return data;
  }

  function svgElement(name, attributes = {}, text) {
    const element = document.createElementNS(svgNamespace, name);
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, String(value));
    }
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function render(data) {
    const days = data.contributions;
    const firstDate = new Date(`${days[0].date}T00:00:00Z`);
    const offset = firstDate.getUTCDay();
    const weeks = Math.ceil((offset + days.length) / 7);
    const total = data.total.lastYear;
    const label = `${numberFormat.format(total)} ${total === 1 ? 'contribution' : 'contributions'} in the last year`;
    const svg = svgElement('svg', {
      class: 'github-graph', viewBox: `0 0 ${weeks * 12 - 3} 81`,
      role: 'img', 'aria-labelledby': 'github-graph-title github-graph-description',
    });
    svg.append(
      svgElement('title', { id: 'github-graph-title' }, label),
      svgElement('desc', { id: 'github-graph-description' },
        `Daily activity for ${username}, from ${dateFormat.format(firstDate)} to ${dateFormat.format(new Date(`${days.at(-1).date}T00:00:00Z`))}. Weeks run left to right; Sunday to Saturday runs top to bottom. Color intensity shows contribution activity.`),
    );

    days.forEach((day, index) => {
      const position = offset + index;
      const square = svgElement('rect', {
        class: 'github-day', 'data-level': day.level,
        x: Math.floor(position / 7) * 12, y: (position % 7) * 12,
        width: 9, height: 9, rx: 2,
      });
      square.append(svgElement('title', {},
        `${numberFormat.format(day.count)} ${day.count === 1 ? 'contribution' : 'contributions'} on ${dateFormat.format(new Date(`${day.date}T00:00:00Z`))}`));
      svg.append(square);
    });

    summary.textContent = label;
    calendar.replaceChildren(svg);
    calendar.hidden = false;
    scrollHint.hidden = false;
    // Start on the most recent weeks when the full year exceeds the viewport.
    calendar.scrollLeft = calendar.scrollWidth;
  }

  async function loadContributions() {
    retry.hidden = true;
    calendar.hidden = true;
    scrollHint.hidden = true;
    summary.textContent = 'Loading contributions…';

    // Storage can be blocked or full without preventing the live request.
    try {
      const cached = JSON.parse(localStorage.getItem(cacheKey));
      const age = Date.now() - cached?.savedAt;
      if (age >= 0 && age < cacheLifetime) {
        render(validate(cached.data));
        return;
      }
    } catch { /* Ignore unavailable or invalid cached data. */ }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(endpoint, {
        signal: controller.signal, credentials: 'omit', referrerPolicy: 'no-referrer',
      });
      if (!response.ok) throw new Error('Contribution request failed');
      const data = validate(await response.json());
      render(data);
      try {
        localStorage.setItem(cacheKey, JSON.stringify({ savedAt: Date.now(), data }));
      } catch { /* The calendar also works without storage. */ }
    } catch {
      summary.textContent = 'Contribution activity couldn’t load. View it on GitHub or try again.';
      retry.hidden = false;
    } finally {
      clearTimeout(timeout);
    }
  }

  retry.addEventListener('click', loadContributions);
  loadContributions();
})();
