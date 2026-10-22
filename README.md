# H2O Cleaning Services — website

Static one-page site for **H2O Cleaning Services** (a division of Pete's Maintenance & Landscaping Services), Guernsey.
Plain HTML + Tailwind CSS + a little vanilla JS. No framework, no server — upload and it works.

---

## Folder structure

```
h2o-cleaning-services/
├── index.html              ← the whole homepage (all text lives here)
├── thank-you.html          ← shown after the quote form if JavaScript is off
├── 404.html                ← "page not found"
├── assets/
│   ├── css/styles.css      ← BUILT Tailwind file (don't edit by hand)
│   ├── js/main.js          ← menu, sliders, tabs, animations, quote form
│   └── img/
│       ├── brand/          ← logo (png/webp), Facebook banner, og-image.jpg (social preview)
│       ├── graphics/van.svg← animated brand van illustration
│       ├── services/       ← service photos
│       ├── van/            ← real van photos
│       └── work/           ← before/after pairs
├── src/input.css           ← EDIT styles here, then build
├── tailwind.config.js      ← brand colours + fonts
├── favicon.ico, favicon-32x32.png, apple-touch-icon.png, android-chrome-*.png, site.webmanifest
├── robots.txt, sitemap.xml ← SEO
└── _headers                ← Cloudflare Pages caching headers
```

Every section in `index.html` starts with a big comment banner (`<!-- ===== SERVICES ===== -->` etc.) and has `EDIT:` notes where things are meant to change.

---

## Common edits

| What | Where |
|---|---|
| Availability message (blue bar at the top) | `index.html` → `ANNOUNCEMENT BAR` |
| Phone / email | search `07781 417777`, `+447781417777` and `h2ocleaninggsy@gmail.com` in `index.html` (also in the JSON-LD at the top) |
| Services | `index.html` → `SERVICES` (one `<article>` each). The `data-quote-service` value must match a checkbox `value` in the quote form |
| Before/after jobs | `index.html` → `OUR WORK` (one tab button + one panel each) |
| FAQ | `index.html` → `FAQ`, and keep the FAQ JSON-LD at the bottom of the page matching |
| Facebook / Instagram links | `index.html` → search `facebook.com/` and `instagram.com/` (**currently placeholders — add the real page URLs**) |
| Colours / fonts | `tailwind.config.js` |

### Swapping photos
Each photo exists as `.webp` (used by modern browsers) **and** `.jpg` (fallback). Replace both with the same file name, ~1000px wide.
Before/after pairs must be the **same pixel size** and ideally shot from the same spot.

---

## Styles (Tailwind)

The built `assets/css/styles.css` is committed, so the site works with no build step.
If you change any classes in the HTML/JS or edit `src/input.css`:

```bash
npm install        # first time only
npm run build      # one-off build (minified)
npm run dev        # rebuilds on save while you work
```

---

## Quote form (FormSubmit)

The form posts to `https://formsubmit.co/toby1@greggs.org` via AJAX (with a normal-POST fallback to `thank-you.html`).

> **Temporary:** requests currently go to the developer's inbox for testing. Before handover, change the form `action` in `index.html` back to `https://formsubmit.co/h2ocleaninggsy@gmail.com` and activate it from that inbox.

1. After the site is live, send **one test request**.
2. FormSubmit emails the address in the form `action` an **activation link** — click it. Until then no requests are delivered.
3. Optional: FormSubmit then gives a random alias string; swap the email in the form `action` for it to hide the address from bots.

Included: honeypot spam field, table-formatted emails, an auto-reply to the customer (if they give an email), and all ticked services combined into one "services" line.

---

## Domain + SEO

The site assumes **`https://www.h2ocleaning.gg`**. If the real domain is different, find + replace that string in:
`index.html`, `robots.txt`, `sitemap.xml` (and the `_next` hidden field in the form).

Already set up: title + meta description, canonical URL, Open Graph/Twitter preview image, LocalBusiness + FAQ structured data, sitemap, robots, alt text on every image, lazy-loaded images, webp, `en-GB`.

After launch: add the site to **Google Search Console** and submit `sitemap.xml`, and create/claim a **Google Business Profile** linking to the site — that's the biggest win for "gutter cleaning Guernsey" style searches.

---

## Deploying (Cloudflare Pages)

Connect the GitHub repo → Framework preset **None** → build command **empty** → output directory **`/`**.
(Or set build command `npm run build` if you'd rather it rebuild CSS on every push.)
