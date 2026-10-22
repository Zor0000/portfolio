# Neeraj Chormale — portfolio

A small, static portfolio in the After Hours theme: warm charcoal, sage accents,
local fonts, and a flowing white-to-green headline. No build step or runtime
dependencies are required.

## Run locally

```sh
python3 -m http.server 4310 --bind 127.0.0.1
```

Open <http://127.0.0.1:4310/>.

## Pages

- `index.html`: introduction, four selected projects, résumé, and contact links.
- `projects.html`: all six projects, each with a dedicated page in `projects/`.
- `about.html`: biography, photo, all three roles, full toolkit, education,
  certifications, live GitHub contributions, résumé, and contact details.
- `setzo/`: existing Setzo app, support, privacy, and terms pages.
- `previews/`: previous local design explorations, retained for reference.

The shared styles live in `styles.css`. The small `script.js` updates the copyright
year and sends old one-page links (`#about`, `#work`, `#skills`, `#education`) to
their new locations. Core portfolio content and navigation work without JavaScript.
The heading animation follows the visitor's reduced-motion preference.

The About page's `github-contributions.js` loads the last year of activity for
`Zor0000` from the public [GitHub Contributions API](https://github.com/grubersjoe/github-contributions-api).
It caches successful responses in the visitor's browser for one hour and needs no
API token. The calendar supports both themes, daily date/count tooltips, and
horizontal scrolling on small screens. If the service is unavailable, a retry
button and the profile link remain available; without JavaScript the profile
link still works.

DM Sans and Instrument Serif are bundled in `assets/fonts/` with their OFL licenses.
The résumé and certificate image retain their original paths. Canonical page URLs
use `https://www.neeraj.works/`, matching the existing Setzo pages.

Production is published from the `main` branch through the existing GitHub–Vercel
integration, at <https://www.neeraj.works/>. Design previews and unrelated local
résumé drafts are kept outside the published source changes.
