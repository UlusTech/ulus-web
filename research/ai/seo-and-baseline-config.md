# SEO and baseline configuration

**Date:** 2026-07-25, amended 2026-07-26 · **Split from `astro-stack-2026.md` §4.1, §4.2**
**Versions pinned:** Astro 7.1.3, `@astrojs/sitemap` 3.7.3 (both confirmed installed, `bun.lock`
2026-07-26)
**Status:** mostly settled. See [`README.md`](README.md) for provenance markers.

---

## Baseline config decisions

| Option | Value | Why |
| ------ | ----- | --- |
| `site` | `https://ulus.me` | decided 2026-07-26. Load-bearing: without it canonical URLs and the sitemap are wrong or absent **[V]** |
| `output` | `static` | landing pages; closes off Actions and Server Islands until an adapter is added |
| `trailingSlash` | decide once, never change | URL identity. Flipping it after indexing means redirects for every page **[I]** |
| `prefetch` | `prefetchAll: true`, `defaultStrategy: 'hover'` | see [`page-transitions-prefetch.md`](page-transitions-prefetch.md) |
| `build.inlineStylesheets` | `'auto'` | inlines small stylesheets into the HTML, which is what keeps the first response small |

`site`, `base` and `trailingSlash` are the three options that determine URL identity. **[V]** —
[Configuring Astro](https://docs.astro.build/en/guides/configuring-astro/)

## What static output already wins

Astro renders to static HTML at build time and ships zero client JS by default, so the `<h1>`, body
copy, and structured data are present in the raw first response with no configuration. Most of the
mechanical half of SEO is therefore "do not undo this". **[I]**

## What still has to be hand-built

A dedicated `<SEO />` component rather than a wrapper package. Roughly 30–60 lines, and writing it
avoids a dependency whose only job is to emit meta tags — the "protocol over implementation" call.
It must own:

- `<title>` and a unique meta description per page
- `<link rel="canonical">`, derived from `Astro.site` + `Astro.url.pathname`
- `hreflang` alternates **and** `x-default`. Hand-rolled here, because `@astrojs/sitemap`'s `i18n`
  option matches path *prefixes* and this site uses translated segments — see
  [`i18n-translated-segments.md`](i18n-translated-segments.md). `x-default` pointing at Turkish is
  the statement that Turkish is the canonical version.
- Open Graph and Twitter card tags, with `og:locale` per language
- `<html lang>` — driven by the same language value as everything else, never sniffed from the URL

## JSON-LD

For an umbrella organization with semi-independent birimler, an `Organization` block with
`subOrganization` entries is the highest-leverage SEO artifact available: it is how the birim
structure is expressed to crawlers at all. Per-page types (`Article`, `BreadcrumbList`) go where they
are relevant. **[I]**

Two disciplines that matter more than the markup:

1. **Structured data must describe what a visitor can actually see.** More JSON-LD is not better;
   duplicated or fictional markup makes the page harder to trust.
2. **Do not assert facts that are not established.** The Claude-web session's JSON-LD block contained
   two errors that would have shipped as fabricated claims about a real organization:
   `"nonprofitStatus": "Nonprofit501c3"` (a **US IRS** designation — Ulus is a Turkish *federasyon*)
   and `"foundingDate": "2023"` (invented). Wrong structured data is worse than absent structured
   data. Every field must be one Bilgehan can confirm.

Type it with `schema-dts` so property names are checked rather than guessed. **[W]** Validate once
against Google's Rich Results test, then stop thinking about it.

## Sitemap and robots

- `@astrojs/sitemap` emits `sitemap-index.xml` at build; requires `site`. **[V]** —
  [Sitemap integration](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
- **Only canonical UTF-8 routes belong in it.** The ASCII aliases must be excluded or the site
  publishes duplicate content pointing at its own canonical. **[I]**
- Deciding which routes belong is the real work — utility routes, duplicate archives, and any
  staging surface need an intentional policy. **[W/I]**
- `robots.txt` pointing at `/sitemap-index.xml`. Since the goal is to be indexed *including* by AI
  crawlers, naming them with explicit `Allow` is a deliberate statement rather than a technicality —
  most organizations are doing the opposite.

## The first-response budget

The stated goal is the "14kB feeling": the compressed HTML of the first response, including inlined
critical CSS, small enough to arrive in the first TCP round trip. Mechanism: congestion window starts
around 10 packets ≈ 14KB, then doubles per round trip; it is a **latency** constraint, not a
bandwidth one, and it matters most on slow mobile connections. **[W]** — asserted by the Claude-web
session; the mechanism is well known but the specific numbers are not verified here.

Levers, in rough order of effect: inline critical CSS and defer the rest; self-host subsetted
variable fonts (Latin + Turkish `ı ğ ş ç ö ü İ Ğ Ş Ç Ö Ü`) with `font-display: swap` and a preload;
brotli precompression at build time rather than on the fly; `loading="eager"` +
`fetchpriority="high"` on the LCP image and `lazy` on everything below the fold. Images do not count
toward the budget — the question is whether something meaningful renders from the first response.

**Do not set a hard CI gate on 14336 bytes before measuring.** That number is inherited folk wisdom.
Measure the homepage's actual compressed size first, record it as the baseline, then gate on
regression from it. A gate on an unmeasured number gets bypassed within two PRs. **[I]**

## Open for research

- [ ] `initcwnd` tuning on the VDS — claimed that raising it to 32 (with
      `tcp_slow_start_after_idle = 0`) sends ~46KB in the first RTT. We control the box, so it is
      actionable, but the claim is unverified and it is a kernel-level change. **[W]**
- [ ] Whether `@astrojs/sitemap` offers any supported way to express alternates for non-prefix
      locale routing. **[G]**
- [ ] Current guidance on `llms.txt` — whether it has moved from proposal toward anything a search
      engine actually consumes. Cheap to generate either way, and the per-page `.md` twin is
      independently useful for the regulations reader. **[W]**
