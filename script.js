/* ============================================================
   Neeraj Chormale — portfolio
   Just enough script: the year, a live Pune clock, and
   sections that settle in as you scroll to them.
   ============================================================ */

// --- Colophon year ---------------------------------------------------------
document.getElementById("year").textContent = new Date().getFullYear();

// --- Live local time in Pune ----------------------------------------------
// Ties the "Pune, India" label to an actual ticking clock (IST, 24h).
(function clock() {
  const el = document.getElementById("clock");
  if (!el) return;

  const fmt = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  });

  const tick = () => { el.textContent = fmt.format(new Date()); };
  tick();
  setInterval(tick, 15000); // minute-resolution; 15s keeps the rollover tight
})();

// --- Reveal sections on scroll --------------------------------------------
// Progressive enhancement: the .js class (set in <head>) hides these first,
// so anyone without JS still gets the full page with no flash.
(function reveal() {
  const items = document.querySelectorAll(".masthead, .row, .colophon");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  items.forEach((el) => io.observe(el));
})();
