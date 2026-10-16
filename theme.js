/* Run before the stylesheet so saved themes never flash during navigation. */
(() => {
  const root = document.documentElement;
  const storageKey = 'portfolio-theme';
  const normalize = value => value === 'day' ? 'day' : 'night';
  let initialTheme = 'night';
  try { initialTheme = normalize(localStorage.getItem(storageKey)); } catch {}
  root.dataset.theme = initialTheme;

  function applyTheme(theme) {
    root.dataset.theme = normalize(theme);
    const isDay = root.dataset.theme === 'day';
    const label = isDay ? 'Switch to night mode' : 'Switch to day mode';
    document.querySelectorAll('.theme-toggle').forEach(button => {
      button.setAttribute('aria-label', label);
      button.title = label;
      button.hidden = false;
    });
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = getComputedStyle(root).getPropertyValue('--paper').trim();
    document.dispatchEvent(new CustomEvent('themechange'));
  }

  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(root.dataset.theme);
    document.querySelectorAll('.theme-toggle').forEach(button => {
      button.addEventListener('click', () => {
        const theme = root.dataset.theme === 'day' ? 'night' : 'day';
        applyTheme(theme);
        try { localStorage.setItem(storageKey, theme); } catch {}
      });
    });
  });
  window.addEventListener('storage', event => {
    if (event.key === storageKey || event.key === null) applyTheme(event.newValue);
  });
})();
