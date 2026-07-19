# SEO Audit — aadityabhatnagar.online

Audited 2026-07-14. 11 parallel specialist passes (technical, content/E-E-A-T, schema, sitemap, performance, visual/mobile, GEO/AI search, live Search Console data, local SEO, search experience/SXO, backlinks).

**Updated 2026-07-19:** logo converted to WebP, header nav rebranded to "AB Labs", IndexNow implemented and submitted, remote-vs-onsite FAQ added, and the site migrated from GitHub Pages to Vercel — which fixed the `www` TLS cert and missing security-headers items directly. See "2026-07-19 update" section at the bottom for full detail.

## Scores

| Category | Weight | Score |
|---|---|---|
| Content Quality | 23% | 45/100 |
| Technical SEO | 22% | 78/100 |
| On-Page SEO | 20% | ~70/100 |
| AI Search Readiness (GEO) | 10% | 67/100 |
| Schema | 10% | ~65/100 |
| Performance | 10% | ~75/100 |
| Images | 5% | 90/100 |
| **Overall SEO Health Score** | | **67/100** |
| Local SEO (separate score) | | 34/100 |

*Scores above are from the original 2026-07-14 audit and haven't been recalculated. Technical SEO and On-Page SEO in particular should score higher now given the TLS/security-header/IndexNow fixes below — a fresh scoring pass would be needed for an updated number.*

---

## Critical

- [x] **`https://www.aadityabhatnagar.online/` broken TLS certificate — fixed via Vercel migration.** Site moved from GitHub Pages to Vercel on 2026-07-19 (`CNAME` file deleted, `vercel.json` added). Vercel issues valid certs for both apex and `www` automatically. Domain redirect direction was flipped so `aadityabhatnagar.online` (apex) is primary/serves directly, and `www` 308-redirects to it — matching every canonical tag, schema `url`, and sitemap `<loc>` already in the code. Verified via `curl` headers on both hosts.
- [x] ~~Blog posts have no mobile navigation.~~ **Correction:** false positive. `assets/site-shell.css` indeed has no mobile-menu rules, but the live blog template (`blogs/<slug>/index.html`) loads `assets/site-nav.js`, which injects the full mobile-menu CSS and builds the hamburger button/menu at runtime. Verified present in 52/53 posts; the 53rd (`lead-systems`) is an intentional `noindex` redirect stub, not a live page. No fix needed.
- [x] **Added `ProfessionalService` (LocalBusiness) JSON-LD node to the homepage entity graph** (`index.html`, `@id: #localbusiness`) — name, telephone, email, `areaServed`, `priceRange`, and a locality-level address (Ajmer, Rajasthan, IN; no fabricated street address since this is a service-area business with no public storefront), linked to the existing Person/Organization nodes. Validated the JSON-LD still parses correctly. **Still requires action outside this repo:** actually creating and verifying the Google Business Profile listing itself — schema markup alone doesn't create a GBP entry.

## High

- [x] **12 legacy blog posts (dated 2026-05-18) expanded** from 78-118 words to ~290-350 words of article body each (plus FAQ content), with client-anecdote style and concrete numbers matching the July-batch voice. `dateModified` bumped to 2026-07-16 in schema, visible "Updated" date, and sitemap `lastmod`, on all 12. List: `automation-after-website`, `business-tools`, `clinic-websites`, `contact-options`, `contact-systems`, `landing-pages`, `minimalist-website-design`, `practical-ux-layouts`, `simple-dashboards`, `useful-automation`, `website-launch`, `website-pages`. (`lead-systems` confirmed to be an intentional `noindex` redirect stub, not thin content — left as-is.)
- [x] **No HTTP security headers site-wide — fixed via Vercel migration.** `vercel.json` now sets `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` on every response, plus path-specific `X-Robots-Tag` rules (replacing the dead Netlify-syntax `_headers` file that never worked on GitHub Pages). Verified live via `curl -I`. `Content-Security-Policy` intentionally skipped — needs careful testing against GTM/fonts/WhatsApp embeds before adding.
- [x] **IndexNow implemented.** Key file `84f9b7d7034e45549f609cefd2e2d4d3.txt` live at domain root, submission script at `scripts/submit-indexnow.js` (`npm run indexnow`), all 70 sitemap URLs submitted — API responded 202 Accepted.
- [x] **`llms.txt` and `full-llms.txt` synced with all 52 live blog posts** (was ~12). `lead-systems` correctly excluded as a noindex redirect stub.
- [ ] **Zero backlinks, zero citations, zero reviews.** Not a code fix — needs outreach (client footer credit links, directory listings).

## Medium

- [x] **Duplicate inline CSS on homepage/services/about extracted** to `/assets/home.css`, `/assets/services-page.css`, `/assets/about-page.css` respectively, now cached externally like the blog template. Verified via local preview that all three pages still load and render correctly with the extracted files.
- [x] **Font preload added** for the actual Inter and Playfair Display woff2 files (fetched real hashed URLs from Google Fonts, added `<link rel="preload" as="font">` across all 107 HTML files that load these fonts).
- [x] **Meta descriptions shortened:** homepage now 143 chars, `/about/` now 157 chars — both within the ~155-160 char SERP snippet limit.
- [x] **`robots.txt` no longer disallows `/project-tracker/`** — removed, relies on the page's own `noindex` tag.
- [x] **FAQPage/BreadcrumbList schema added** to all 12 expanded legacy posts (see High-priority item above) — done in the same pass.
- [ ] **No dedicated location/service-area landing pages.** Content-strategy decision, not attempted — the four `/industries/*` stub pages are a judgment call on scope, left for you to decide.

## Low

- [x] **Dual-branding ambiguity resolved — decided in favor of "AB Labs".** Header nav brand text changed from "Aaditya." to "AB Labs" across all 112 HTML files, now consistent with the "AB Labs by Aaditya" already used in meta tags, schema, mobile menu, and footer.
- [x] **`/case-studies/` pages now link into the shared entity graph** — the listing page's `CollectionPage` node and all 4 individual case-study `Article` nodes now reference the homepage's `#organization`/`#aaditya`/`#website` `@id`s instead of duplicating minimal stubs. Validated all 5 files' JSON-LD still parses.
- [x] **Dead `robots.txt` rule for `/demo/` removed.**
- [x] **GTM inline script now loads after `<meta charset="UTF-8">`** in `<head>`, across all 9 affected files (home, about, blog, portfolio, privacy — both folder and flat-file versions).
- [x] **Logo converted to WebP.** `logo.png` (53.6KB) → `logo.webp` (25.4KB, 52% smaller), served via `<picture>` with PNG fallback for older browsers. Verified in browser.
- [x] **Added structured `geo` coordinates** (city-center lat/long for Ajmer, Rajasthan) to the homepage's `ProfessionalService` schema node, alongside the existing text-based `geo.placename` meta tag.
- [x] **Remote vs. on-site statement added.** New FAQ item "Do you work remotely or on-site?" added to both the visible homepage FAQ list and the matching `FAQPage` JSON-LD, clarifying remote work for India/worldwide clients plus on-site availability in Ajmer.

---

## What's already working well (no action needed)

- Sitemap: clean XML, all 70 URLs resolve 200, correct varied lastmod dates, properly excludes redirect stubs from indexing.
- Crawlability/indexability: robots.txt, canonical tags, meta robots directives all correctly configured.
- Live GSC data confirms indexing is progressing normally: 7 of 10 sampled URLs already indexed (crawled July 8); the 3 newest weren't crawled yet as of this audit — normal lag, indexing was only requested hours earlier.
- New-batch content (30 posts published this session) has genuinely good E-E-A-T signals: specific client anecdotes, checkable ₹ numbers, consistent FAQPage + BreadcrumbList schema matching visible content exactly.
- Page weight is lean (~120-130KB critical path, <300KB total including lazy images) — no bloat.
- Images: minimal footprint (6 on homepage), all correctly lazy-loaded with explicit width/height (CLS-safe), modern WebP format.
- JS correctly deferred to end of `<body>`, no blocking first-party scripts.
- The "n8n vs Zapier" / "AI automation cost" content gap flagged by one automated pass was a false alarm — those posts exist (`/blogs/n8n-vs-zapier/`, `/blogs/ai-automation-cost/`), the pass just used live search data that couldn't see unindexed pages yet.

---

## Suggested order of attack

1. ~~**This week:** Fix `www` TLS cert, fix blog mobile nav CSS.~~ Done via Vercel migration (2026-07-19).
2. **Still open:** Create/verify Google Business Profile listing (schema exists, listing itself doesn't yet).
3. **Ongoing:** Client footer credit links + directory listings as projects ship, to start building backlinks/citations from zero.
4. **Content-strategy decision, not started:** dedicated location/service-area landing pages (the `/industries/*` stubs).
5. **Re-check in 4-6 weeks:** backlink profile (Common Crawl re-index), content/GEO scores after the legacy-post rewrite.

---

## 2026-07-19 update — logo, rebrand, IndexNow, Vercel migration

**Code changes (pushed to `main`):**
- `logo.png` → `logo.webp` (52% smaller), served via `<picture>` + PNG fallback ([index.html](index.html))
- Header nav rebrand "Aaditya." → "AB Labs" across all 112 HTML files
- IndexNow key file + `scripts/submit-indexnow.js` (`npm run indexnow`) — 70 URLs submitted, 202 Accepted
- Remote-vs-onsite FAQ added to homepage (visible + `FAQPage` schema)
- `vercel.json` added with security headers + robots-tag rules (replaces dead Netlify-syntax `_headers` file)
- `CNAME` deleted (GitHub Pages custom-domain binding removed)

**Infra changes (Vercel dashboard, outside this repo):**
- Site imported into Vercel, both `aadityabhatnagar.online` and `www.aadityabhatnagar.online` added as domains
- Domain redirect direction set so apex is primary (serves directly), `www` redirects to apex — matches existing canonical tags/schema/sitemap
- Verified live: valid TLS on both hosts, all security headers present, `X-Robots-Tag` overrides working correctly on `robots.txt`/`sitemap.xml`/`/demo/*`/`/project-tracker/*`

**Search Console housekeeping (via OAuth scripts in `~/.config/claude-seo/`):**
- `sitemap.xml` resubmitted (was stale since before migration) — confirmed re-crawled same day
- Indexing requested for `/services/` and `/about/`, which were showing "URL is unknown to Google" — as of same-day recheck, both moved to "Discovered - currently not indexed" (normal queue progression, not yet fully indexed)
- Deleted a stale, erroring `ads.html` sitemap entry (leftover from March, unrelated to current site)
- A one-time scheduled recheck (`gsc-indexing-recheck` task) is set to run 2026-07-20 10:00 IST to confirm `/services/` and `/about/` have finished indexing
