/* Small progressive enhancements. Content and links work without JavaScript. */
document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

// Keep links to sections from the previous one-page portfolio useful.
if (document.body.classList.contains("home")) {
  const previousSections = {
    "#about": "about.html#about",
    "#work": "about.html#experience",
    "#skills": "about.html#skills",
    "#education": "about.html#education",
  };
  const openPreviousSection = () => {
    if (Object.hasOwn(previousSections, window.location.hash)) {
      window.location.replace(previousSections[window.location.hash]);
    }
  };
  openPreviousSection();
  window.addEventListener("hashchange", openPreviousSection);
}
