/* ============================================================
   Neeraj Chormale — portfolio
   Nav frost-on-scroll, mobile menu, theme toggle, and
   scroll-triggered reveals. No dependencies.
   ============================================================ */

// --- Colophon year ---------------------------------------------------------
document.getElementById("year").textContent = new Date().getFullYear();

// --- Frosted nav on scroll -------------------------------------------------
(function navScroll() {
  const nav = document.getElementById("nav");
  if (!nav) return;
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();

// --- Mobile menu -----------------------------------------------------------
(function mobileMenu() {
  const burger = document.getElementById("navBurger");
  const links = document.getElementById("navLinks");
  if (!burger || !links) return;

  const close = () => {
    links.classList.remove("is-open");
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  };

  burger.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
  });

  // Close after tapping a link
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
})();

// --- Theme toggle ----------------------------------------------------------
(function theme() {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const dark = document.documentElement.getAttribute("data-theme") === "dark";
    const next = dark ? "light" : "dark";
    if (next === "dark") document.documentElement.setAttribute("data-theme", "dark");
    else document.documentElement.removeAttribute("data-theme");
    try { localStorage.setItem("theme", next); } catch (e) {}
  });
})();

// --- Reveal on scroll ------------------------------------------------------
// Progressive enhancement: the .js class (set in <head>) hides .reveal first,
// so a no-JS visitor still sees the full page with no flash.
(function reveal() {
  const items = document.querySelectorAll(".reveal");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-in"));
    return;
  }

  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
  );

  items.forEach((el) => io.observe(el));
})();
