# AGENTS.md

Static marketing landing page for NEXABUILD. No build step, package manager, bundler, tests, or linter.

## Stack / structure
- Four hand-written files, no dependencies:
  - `index.html` — single-page layout (navbar, hero, contact form, services, projects, about, footer)
  - `styles.css` — all styling
  - `translations.js` — the `translations` dictionary (a global `const`)
  - `script.js` — canvas background, scroll nav, i18n, counters, reveal, form validation
- To preview, just open `index.html` in a browser (or `python3 -m http.server`).

## i18n (easy to get wrong)
- 4 locales: `fr` (default), `ru`, `ka`, `ce`.
- Script order matters: `index.html` loads `translations.js` **before** `script.js` (script.js reads the global `translations`).
- Text is wired via attributes, mapped to keys in `translations.js`:
  - `data-i18n` — plain text (written via `innerHTML`)
  - `data-i18n-html` — markup allowed (e.g. gradient `<span>`, arrow)
  - `data-i18n-ph` — input/textarea `placeholder`
- Adding a string requires adding the same key to **all four** locale objects, or it silently falls back to French (`translations[lang] || translations.fr`).
- Selected language is persisted in `localStorage` under key `nexabuild-lang`.

## Conventions
- Content/labels live in `translations.js` and `index.html` attributes; `script.js` only applies them, so don't hardcode user-facing text in JS.
- The contact form submission is simulated (`setTimeout` in `script.js`); there is no backend.
