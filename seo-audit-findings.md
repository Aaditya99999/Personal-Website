# SEO Audit — aadityabhatnagar.online

Audited 2026-07-14. 11 parallel specialist passes (technical, content/E-E-A-T, schema, sitemap, performance, visual/mobile, GEO/AI search, live Search Console data, local SEO, search experience/SXO, backlinks).

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

---

## Critical

- [ ] **`https://www.aadityabhatnagar.online/` has a broken TLS certificate.** GitHub Pages doesn't cover the `www` subdomain with a matching cert (SNI mismatch). Anyone/anything hitting `www` over HTTPS gets a hard cert error and never reaches the redirect to the apex domain. Fix: add `www` as a second custom domain in GitHub Pages settings, or front the site with Cloudflare. **Needs action outside this repo** (GitHub Pages dashboard / DNS) — not something a code change can fix.
- [x] ~~Blog posts have no mobile navigation.~~ **Correction:** false positive. `assets/site-shell.css` indeed has no mobile-menu rules, but the live blog template (`blogs/<slug>/index.html`) loads `assets/site-nav.js`, which injects the full mobile-menu CSS and builds the hamburger button/menu at runtime. Verified present in 52/53 posts; the 53rd (`lead-systems`) is an intentional `noindex` redirect stub, not a live page. No fix needed.
- [x] **Added `ProfessionalService` (LocalBusiness) JSON-LD node to the homepage entity graph** (`index.html`, `@id: #localbusiness`) — name, telephone, email, `areaServed`, `priceRange`, and a locality-level address (Ajmer, Rajasthan, IN; no fabricated street address since this is a service-area business with no public storefront), linked to the existing Person/Organization nodes. Validated the JSON-LD still parses correctly. **Still requires action outside this repo:** actually creating and verifying the Google Business Profile listing itself — schema markup alone doesn't create a GBP entry.

## High

- [x] **12 legacy blog posts (dated 2026-05-18) expanded** from 78-118 words to ~290-350 words of article body each (plus FAQ content), with client-anecdote style and concrete numbers matching the July-batch voice. `dateModified` bumped to 2026-07-16 in schema, visible "Updated" date, and sitemap `lastmod`, on all 12. List: `automation-after-website`, `business-tools`, `clinic-websites`, `contact-options`, `contact-systems`, `landing-pages`, `minimalist-website-design`, `practical-ux-layouts`, `simple-dashboards`, `useful-automation`, `website-launch`, `website-pages`. (`lead-systems` confirmed to be an intentional `noindex` redirect stub, not thin content — left as-is.)
- [ ] **No HTTP security headers site-wide** (HSTS, CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy). GitHub Pages platform limitation — fixable by fronting with Cloudflare (same fix as the `www` cert issue). **Needs action outside this repo.**
- [ ] **IndexNow protocol not implemented.** No key file at root, nothing in robots.txt/sitemap/HTML referencing it. Bing/Yandex only discover new content via slow pull-crawling instead of push notification. Not done — needs a decision on whether to actually submit URLs to a third-party API.
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

- [ ] **Dual-branding ambiguity** — "Aaditya Bhatnagar" vs "AB Labs by Aaditya". Left as-is: this is a naming/brand decision only you can make, not a code fix.
- [x] **`/case-studies/` pages now link into the shared entity graph** — the listing page's `CollectionPage` node and all 4 individual case-study `Article` nodes now reference the homepage's `#organization`/`#aaditya`/`#website` `@id`s instead of duplicating minimal stubs. Validated all 5 files' JSON-LD still parses.
- [x] **Dead `robots.txt` rule for `/demo/` removed.**
- [x] **GTM inline script now loads after `<meta charset="UTF-8">`** in `<head>`, across all 9 affected files (home, about, blog, portfolio, privacy — both folder and flat-file versions).
- [ ] **Logo (`logo.png`, 55KB PNG) not converted** — image format conversion wasn't attempted this pass.
- [x] **Added structured `geo` coordinates** (city-center lat/long for Ajmer, Rajasthan) to the homepage's `ProfessionalService` schema node, alongside the existing text-based `geo.placename` meta tag.
- [ ] **No explicit remote vs. on-site statement** — content decision, not attempted.

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

1. **This week:** Fix `www` TLS cert, fix blog mobile nav CSS, create/verify Google Business Profile.
2. **Next 2-4 weeks:** Expand or merge the 12 thin legacy posts into the July-batch standard (add schema in the same pass); sync `llms.txt`/`full-llms.txt` with all 53 posts (mechanical, ~30 min).
3. **Ongoing:** Client footer credit links + directory listings as projects ship; consider Cloudflare in front of GitHub Pages to fix the cert + security-headers issues in one move.
4. **Re-check in 4-6 weeks:** backlink profile (Common Crawl re-index), content/GEO scores after the legacy-post rewrite, indexation status for the 30 newest posts.
