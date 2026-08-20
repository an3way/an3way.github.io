# an3way / The Archive

Personal site and running record of work in design, cybersecurity, and software. Live at [an3way.github.io](https://an3way.github.io).

## About

Four rooms, one exhibit. The site is built around a simple idea: showcase work the way a small museum would, each project or area held under glass rather than dropped into a generic project grid.

- **Design Lab**: interface and visual design work
- **Security Vault**: offensive security, privacy engineering, systems thinking
- **AI Studio**: local and hosted model experiments
- **Build Archive**: software projects and prototypes

Selected work is currently [Breach Checker](https://github.com/an3way/breachchecker), a k-anonymity password-breach lookup tool. That section pulls live stars, language, and last-updated data from the GitHub API on page load.

## Stack

No frameworks, no build step. Three files:

```
index.html   structure
style.css    design system (custom properties for color, type, motion)
script.js    scroll reveals, nav, ambient canvas, live repo stats
```

## Running locally

```bash
git clone https://github.com/an3way/an3way.github.io.git
cd an3way.github.io
python -m http.server 8000
```

Then open `http://localhost:8000`. A local server (rather than opening `index.html` directly) is needed so the live GitHub stats fetch isn't blocked by the browser's file:// CORS restrictions.

## Notes

- Respects `prefers-reduced-motion` throughout: reveals, petals, and cursor glow all degrade to static states.
- Fully usable without hover: pointer-tilt and spotlight effects on the exhibit cards are enhancement only, not a requirement to read or navigate.

## License

No license granted. Feel free to use this as a reference for your own build, but please don't republish it as your own work.
