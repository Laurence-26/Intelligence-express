# Intelligence Express — website

Static marketing site for **Intelligence Express**, a cargo, parcel and relocation
company based in Kariakoo, Dar es Salaam.

> Hatubebi tu mizigo — tunabeba na biashara yako.
> *We don't just carry cargo — we carry your business.*

## What's here

Plain HTML, CSS and JavaScript. No build step, no dependencies, no framework —
open `index.html` and it runs.

```
index.html                  the whole page
css/styles.css              styles (design tokens at the top of the file)
js/app.js                   language switching, tracking, forms, modal, nav
assets/                     photography and logo
content/brand-copy.md       the original Swahili launch copy the site is built from
tests/interactions.html     browser test page for the interactive bits
```

## Features

- **Bilingual, Swahili first.** Every translatable string carries a `data-i18n`
  key; `js/app.js` holds the `sw` / `en` dictionaries. The choice is remembered in
  `localStorage`, and falls back to the browser language on a first visit.
- **Pickup booking.** Both the inline form and the modal build a pre-filled
  WhatsApp message to `+255 690 500 000` — no backend, nothing to host or secure.
- **Shipment tracking (demo).** `SHIPMENTS` in `js/app.js` is a small hard-coded
  dataset — `IE-4821`, `IE-7390`, `IE-1156` — so the flow can be demonstrated.
  Wiring it to a real system means replacing the lookup in `initTracking()` with a
  `fetch()` to an API that returns the same shape.
- Responsive down to small phones, keyboard accessible (skip link, focus styles,
  Escape-to-close and focus trapping in the modal), `prefers-reduced-motion`
  respected, and `MovingCompany` schema.org data for search engines.

## Running it locally

Any static file server works. Opening `index.html` directly from disk is fine too.

```sh
python -m http.server 8000
# then visit http://localhost:8000
```

## Tests

`tests/interactions.html` drives the real page in an iframe and checks the parts
that can silently break: language switching (including re-rendering a tracking
result in the new language), the tracking lookup for both known and unknown
codes, modal open/Escape/scroll-lock, the WhatsApp message the forms build,
required-field validation, and the mobile nav. Serve the repo and open it:

```sh
python -m http.server 8000
# http://localhost:8000/tests/interactions.html  → 30/30
```

## Editing content

- **Text:** change it in `index.html` (Swahili, what the page ships with) *and* in
  the matching `sw` key in `js/app.js`. The English copy lives only in the `en`
  dictionary. Keys are shared, so both must exist or the switch will leave a
  string untranslated.
- **Phone / WhatsApp:** the number appears in `index.html` (`tel:` and `wa.me`
  links, JSON-LD) and as `WHATSAPP` at the top of `js/app.js`.
- **Colours and spacing:** the `:root` custom properties in `css/styles.css`.
- **Photos:** drop replacements into `assets/` keeping the same filenames, or
  update the `src` attributes.

## Deploying

It's a static site, so anything serves it: GitHub Pages (Settings → Pages →
deploy from branch, root), Netlify, Vercel, or ordinary shared hosting via FTP.
No environment variables, no server-side code.

If you put it on a real domain, update the `canonical` URL and the `og:image`
path in `index.html` to absolute URLs.

---

© Intelligence Express. Photography, logo and copy belong to the company.

📍 Kariakoo, mtaa wa Likoma na Pemba, Dar es Salaam
📞 0690 500 000 · 0690 300 000
