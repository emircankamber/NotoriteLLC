# NOTORITE LLC — company website

Static catalog and quote-request site for NOTORITE LLC, a US wholesale supplier of everyday home goods.
Plain HTML, CSS and vanilla JS. No framework, no build step.

```
.
├── index.html          Main page (hero, categories, how it works, about, quote form)
├── privacy.html        Privacy notice (DRAFT: review before launch)
├── 404.html            Not-found page (Vercel serves it automatically)
├── config.js           Company details + form endpoint: the only file you need to edit
├── favicon.svg
├── robots.txt
├── sitemap.xml
├── vercel.json         Cache and security headers
├── assets/
│   ├── css/styles.css  All styles, brand tokens at the top
│   ├── js/main.js      Nav, reveal motion, config rendering, quote form
│   ├── js/page.js      Small script for privacy/404
│   └── img/            Optimized WebP/JPG images (480/800/1400w) + og-image.jpg
├── docs/screenshots/   Playwright screenshots (390 / 768 / 1024 / 1440)
└── source-images/      Original PNGs (not deployed, see .vercelignore)
```

## Run locally

Any static server works. From the project folder:

```bash
python3 -m http.server 4173
```

Then open http://localhost:4173. (Opening `index.html` directly from disk also mostly works, but use a server to test the form.)

## Fill in `config.js`

Open `config.js` and fill in what you have. **Any field left as `""` stays hidden on the site**, so nothing like "TBD" or fake details ever appears.

| Key | What it does |
| --- | --- |
| `COMPANY_LEGAL_NAME` | Already set to `NOTORITE LLC`. |
| `CONTACT_EMAIL` | Shown in the contact section, footer and privacy page; also the address used by the mailto fallback. |
| `PHONE` | Shown in the contact section and footer, linked as `tel:`. |
| `ADDRESS` | Shown in the contact section and footer. |
| `STATE_OF_FORMATION` | Shown in the footer as "Organized in …". |
| `FORM_ENDPOINT` | Where the quote form is sent (see below). |
| `FORM_EXTRA_FIELDS` | Extra fields sent with each submission, e.g. a Web3Forms `access_key`. |

Filled-in email, phone and address are also added to the Organization JSON-LD automatically.

### How the quote form is sent

1. **`FORM_ENDPOINT` set**: the form POSTs JSON to that URL and shows a success message.
2. **`FORM_ENDPOINT` empty, `CONTACT_EMAIL` set**: the visitor's email app opens with the request prefilled, addressed to `CONTACT_EMAIL`.
3. **Both empty**: the form validates but shows "The quote form is not connected yet." Set at least one before launch.

A hidden honeypot field (`website`) silently drops bot submissions.

#### Formspree

1. Create a form at https://formspree.io and copy its endpoint, e.g. `https://formspree.io/f/abcdwxyz`.
2. In `config.js`: `FORM_ENDPOINT: "https://formspree.io/f/abcdwxyz"`.
3. Submit a test request once and confirm the email in Formspree.

#### Web3Forms

1. Get an access key at https://web3forms.com (sent to your email).
2. In `config.js`:
   ```js
   FORM_ENDPOINT: "https://api.web3forms.com/submit",
   FORM_EXTRA_FIELDS: { access_key: "YOUR-ACCESS-KEY" }
   ```

Fields sent: `name, company, email, phone, business_type, categories, quantities, message`, plus `subject` and `from_name`.

## Deploy to Vercel

**Option A, dashboard:** push this folder to a GitHub repo, then in Vercel choose *Add New → Project*, import the repo, set *Framework Preset* to **Other**, leave the build command empty and the output directory as the root. Deploy.

**Option B, CLI:**

```bash
npx vercel --prod
```

After you connect the real domain, replace every `https://example.com/` with it in:
`index.html` (canonical, Open Graph, Twitter, JSON-LD), `privacy.html` (canonical), `robots.txt` and `sitemap.xml`.

## Brand tokens (in `assets/css/styles.css`)

Sampled from the product photos with a script, then fixed as CSS custom properties:

| Token | Hex | Use |
| --- | --- | --- |
| `--paper` | `#F7F2EB` | Page background (the hero's empty side samples at #F7F1EC) |
| `--paper-2` | `#EFE8DE` | Alternate sections |
| `--ink` | `#2B2A27` | Text (12.9:1 on paper) |
| `--ink-soft` | `#5B574F` | Secondary text (6.5:1) |
| `--sage` | `#7B8768` | Large step numerals, selected fills (large text only) |
| `--sage-deep` | `#46523D` | Buttons, links, icons (7.4:1) |
| `--brass` | `#B08D57` | Hairlines and ornaments only, never text (2.8:1) |

Fonts: Fraunces (headings, 300/400) and Instrument Sans (body, 400/500/600) via Google Fonts, loaded without blocking render.
Spacing: 8px scale only (`--s-1` 8 … `--s-8` 128).

## Before launch: owner checklist

- [ ] `CONTACT_EMAIL` (needed for the mailto fallback and the privacy page)
- [ ] `FORM_ENDPOINT` (+ `FORM_EXTRA_FIELDS` for Web3Forms), then send a test request
- [ ] `PHONE`, `ADDRESS`, `STATE_OF_FORMATION` (optional, hidden until filled)
- [ ] Replace `https://example.com/` with the live domain (files listed above)
- [ ] Have the owner or counsel review `privacy.html`, including the "Last updated" date
