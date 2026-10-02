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
  certifications, résumé, and contact details.
- `setzo/`: existing Setzo app, support, privacy, and terms pages.
- `previews/`: previous local design explorations, retained for reference.

The shared styles live in `styles.css`. The small `script.js` updates the copyright
year and sends old one-page links (`#about`, `#work`, `#skills`, `#education`) to
their new locations. All portfolio content and navigation work without JavaScript.
The heading animation follows the visitor's reduced-motion preference.

DM Sans and Instrument Serif are bundled in `assets/fonts/` with their OFL licenses.
The résumé and certificate image retain their original paths. Canonical page URLs
use `https://www.neeraj.works/`, matching the existing Setzo pages.

Production is published from the `main` branch through the existing GitHub–Vercel
integration, at <https://www.neeraj.works/>. Design previews and unrelated local
résumé drafts are kept outside the published source changes.
