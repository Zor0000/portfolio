# Portfolio project showcases

The five project pages share `showcase.css` and `showcase.js`. Setzo keeps its
existing showcase. All illustrations are actual ASCII text, with a static HTML
fallback and a finite canvas hover/tap animation. ReWatch only tilts its artwork;
it has no screenshot reveal. Reduced motion skips the scatter and watch tilt.

Regenerate the text assets and the embedded HTML illustrations from the repo root:

```sh
python3 scripts/build-project-ascii.py
```

Skillonomy reveals an explicitly labelled workflow illustration based on its
existing project description, not a fabricated screenshot or sample conversation.
GymBuddy's minimal graph follows a subset of the repository's graph model:
Exercise–Equipment, Exercise–Muscle, Exercise–Category, and Muscle–Region.
It is a schematic, not a database export.

## Screenshot provenance — captured 2026-10-28

- `gymbuddy-chat.png`: real initial interface at
  https://gymbuddy-gamma-one.vercel.app. The agent's response endpoint returned a
  billing error during capture, so no generated conversation is represented.
- `cooling-simulation.png`: `.sim-wrap` at
  https://zor0000.github.io/datacenter-rl-cooling/. This is the site's browser
  thermal sandbox with its reference controller, not a trained-policy result.
- `cooling-loop.png`: `.diagram-card` from the same live site.
- `campus-discovery.png`: `/` from the locally running CampusHorizon Django
  repository with its saved database.
- `campus-events.png`: `/hackathons/?online=1` from the same local copy. No scraper
  was run and no event data was fabricated. The public Railway URL returned a
  Not Found page, so the local captures are labelled in the portfolio caption.

The PNGs are self-contained assets. Visitor interactions make no calls to the
source applications, model APIs, or databases.
