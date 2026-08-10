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
js/italk.js                 the I Talk assistant
assets/                     photography and logo
content/brand-copy.md       the original Swahili launch copy the site is built from
tests/interactions.html     browser test page for the interactive bits
render.yaml                 Render deployment blueprint
```

## Features

- **Bilingual, Swahili first.** Every translatable string carries a `data-i18n`
  key; `js/app.js` holds the `sw` / `en` dictionaries. The choice is remembered in
  `localStorage`, and falls back to the browser language on a first visit.
- **Pickup booking.** Both the inline form and the modal build a pre-filled
  WhatsApp message to `+255 690 500 000` — no backend, nothing to host or secure.
- **Shipment tracking (demo).** Six sample shipments in `SHIPMENTS`
  (`js/app.js`), each with a route, a 1–4 stage that drives the progress bar, a
  status, an ETA and a timeline. Tap a code chip or type one — `ie4821`,
  `IE 4821` and `IE-4821` all resolve.

  It is deliberately a **fixed set, not a generator**, and every unknown code
  returns "not found". A generator would hand a real customer invented status
  for their real package, which is worse than no tracking at all. The panel
  carries a *Mfumo wa majaribio / Demo system* badge for the same reason.
  Wiring it to a real system means replacing `lookup()` in `js/app.js` with a
  `fetch()` to an API returning the same shape, and dropping the badge.
- **I Talk — the assistant.** A floating helper that answers common questions in
  Swahili and English, looks up a tracking code inline (it drives the tracking
  panel on the page), and hands anything else to WhatsApp. See below.
- **Responsive from 280px to ultrawide.** Checked at 24 widths from 280 to 2560
  CSS pixels, in five states each (at rest, tracking a shipment, assistant open,
  booking modal open, menu open) — 111 checks covering horizontal overflow,
  clipped text and boxes, header pieces overlapping, the floating assistant
  covering a call to action, tap-target height, and grid rhythm (no orphan card
  row, no empty gallery row). Three things make that hold: grid floors are
  written `minmax(min(280px, 100%), 1fr)` so a track never exceeds a narrow
  viewport; form controls carry `min-width: 0` (an `<input>` otherwise claims a
  ~213px intrinsic width and bursts its grid track); and headings use
  `overflow-wrap: break-word` for long Swahili compounds. Below 340px the
  wordmark gives way to the logo alone so the header stays on one line.
- Keyboard accessible (skip link, focus styles, Escape-to-close and focus
  trapping in the modal), `prefers-reduced-motion` respected, and
  `MovingCompany` schema.org data for search engines.

## Running it locally

Any static file server works. Opening `index.html` directly from disk is fine too.

```sh
python -m http.server 8000
# then visit http://localhost:8000
```

## I Talk

`js/italk.js` is a **rule-based assistant, not a language model.** It matches the
visitor's message against a keyword-scored list of topics in `TOPICS` and replies
from written Swahili and English answers. It follows the site's SW/EN toggle, and
recognises a tracking code anywhere in a message.

The rule its answers follow: **never invent a fact about the business.** Prices,
transit times, insurance terms and opening hours are not guessed — those answers
hand the visitor to WhatsApp or the phone. Adding a topic means adding one entry
to `TOPICS` with `keys` (match terms, both languages) and `sw` / `en` answers,
plus optional `actions: ["whatsapp", "call"]`.

### Making it a real AI assistant

It is rule-based for one hard reason: **this is a static site, and a static site
cannot hold an API key.** Anything in `js/` is downloaded by every visitor, so a
key put there is a published key — someone will find it and spend your credit.

Giving I Talk a real model means adding a small server that holds the key:

1. Add a **Web Service** on Render (Node) alongside this static site, with
   `ANTHROPIC_API_KEY` set as an environment variable in the dashboard — never in
   this repo.
2. That service exposes one endpoint that takes the visitor's message, calls
   Claude with a system prompt describing Intelligence Express, and returns the
   text.

```js
// server.js on the Web Service — the key stays here, never in the browser
import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic();               // reads ANTHROPIC_API_KEY

app.post("/api/italk", async (req, res) => {
  const message = await client.messages.create({
    model: "claude-opus-5",
    max_tokens: 1024,
    system: "You are I Talk, the assistant for Intelligence Express, a cargo " +
            "and parcel company in Kariakoo, Dar es Salaam. Answer in the " +
            "language the customer writes in. Never quote a price or a transit " +
            "time — direct those to WhatsApp on +255 690 500 000.",
    messages: [{ role: "user", content: String(req.body.message).slice(0, 2000) }],
  });
  res.json({ reply: message.content.find(b => b.type === "text").text });
});
```

3. In `js/italk.js`, replace the `answer()` call in `send()` with a `fetch()` to
   that endpoint, keeping the current rule-based answers as the offline fallback.

Keep the "never invent a price" instruction in the system prompt — a model will
happily invent one otherwise. Add rate limiting on the endpoint before launch, or
one visitor's script can run up your bill.

## Tests

`tests/interactions.html` drives the real page in an iframe and checks the parts
that can silently break: language switching (including re-rendering a tracking
result in the new language), the tracking lookup — lenient code parsing, stage
count, progress-bar width, delivered styling, and that an unknown code is
*refused rather than faked* — the assistant's answers in both languages, that it
declines to invent a price, that a tracking code in chat drives the panel, modal
open/Escape/scroll-lock, the WhatsApp message the forms build, required-field
validation, and the mobile nav. Serve the repo and open it:

```sh
python -m http.server 8000
# http://localhost:8000/tests/interactions.html  → 67/67
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

### Render (what this repo is set up for)

`render.yaml` describes the whole deployment, so Render configures itself:

1. In the Render dashboard choose **New → Blueprint**.
2. Connect the GitHub account and pick `Laurence-26/Intelligence-express`.
3. Render reads `render.yaml`, shows a static site called
   `intelligence-express`, and you click **Apply**.

There is no build step — Render publishes the repository root as-is — and every
push to `main` redeploys automatically. The free static-site plan is enough.

To set it up by hand instead (**New → Static Site**): leave **Build Command**
empty and set **Publish Directory** to `.`.

The blueprint also sets `nosniff`, `Referrer-Policy` and `X-Frame-Options` on
every response, and a one-day cache on `assets/`, `css/` and `js/`. If you
replace a photo and want it live immediately, either use a new filename or clear
the cache from the Render dashboard.

### Anywhere else

Any static host works: GitHub Pages (Settings → Pages → deploy from branch,
root), Netlify, Vercel, or ordinary shared hosting via FTP. No environment
variables, no server-side code.

If you put it on a real domain, update the `canonical` URL and the `og:image`
path in `index.html` to absolute URLs.

---

© Intelligence Express. Photography, logo and copy belong to the company.

📍 Kariakoo, mtaa wa Likoma na Pemba, Dar es Salaam
📞 0690 500 000 · 0690 300 000
