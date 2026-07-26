# Tooling and packages

**Date:** 2026-07-25, amended 2026-07-26 · **Split from `astro-stack-2026.md` §3**
**Versions pinned:** Astro 7.1.3
**Status:** settled. See [`README.md`](README.md) for provenance markers.

---

Filtered by the lock-in test: **does removing it later require rewriting content or markup?** If yes,
it needs to earn its place. If no, it is cheap to try.

## Recommended

| Package | Purpose | Notes |
| ------- | ------- | ----- |
| `@astrojs/sitemap` | `sitemap-index.xml` | requires `site`. Its `i18n` option does **not** apply here — see [`i18n-translated-segments.md`](i18n-translated-segments.md) **[V]** |
| `astro:assets` | image optimization, built in | needs sharp — see [`runtime-bun-sharp.md`](runtime-bun-sharp.md) |
| `@astrojs/rss` | feeds for `/haber` and per-category | first-party |
| Content Collections | typed frontmatter via Zod schemas | built in; Zod is already house style |
| `@astrojs/check` + `typescript` | the actual type safety | TS 6.x — see [`typescript-7-readiness.md`](typescript-7-readiness.md) |
| `@biomejs/biome` | format + lint + import sort | see [`linting-biome-astro.md`](linting-biome-astro.md) |
| `pagefind` | static search, post-build step | no server, no index service. Turkish stemming needs testing — see below |
| `@fontsource-variable/*` | self-hosted variable fonts | no third-party CDN call: better LCP, and no visitor IP leaves for a third party — relevant under KVKK/GDPR **[W/I]** |
| `astro-icon` + `@iconify-json/*` | SVG icons inlined at build | zero runtime JS, tree-shaken **[W]** |
| `simple-git-hooks` + `nano-staged` | pre-commit | lighter than husky + lint-staged **[W]** |
| `@playwright/test` | smoke tests | five tests maximum — see below |
| `schema-dts` | typed JSON-LD | property names checked, not guessed **[W]** |

## Deliberately not recommended

- **Tailwind.** One site with a fixed design system does not need a utility framework; scoped styles
  in `.astro` plus CSS custom properties are less to remove later. Reversible in minutes — Tailwind
  v4 is configured in CSS via `@theme`, which consumes the same custom properties, so the token
  pipeline is not affected either way. Reconsider if six sites ever share one system, where the
  constraint system is what stops them drifting. **[W/I]**
- **Any UI framework integration** (React/Vue/Svelte). No islands are implied by landing pages;
  adding one turns a zero-JS site into a hydration site.
- **SEO meta wrapper packages** (`astro-seo` and similar). A ~30–60 line `<SEO />` component is
  smaller than the dependency and we need control over JSON-LD anyway. See
  [`seo-and-baseline-config.md`](seo-and-baseline-config.md).
- **`@astrojs/partytown`.** Only needed to offload third-party analytics. Self-hosting Umami or
  Plausible avoids the problem instead of working around it. **[W]**
- **Keystatic (for now).** Git-backed, MIT, first-party Astro integration, writes Markdown — a real
  option. But the team is technical, the content is small, and it has **no multi-locale support**,
  which this site's i18n makes load-bearing. Add it when a non-technical person is actually blocked
  on editing something. **[W]**

## Pagefind specifics

Runs **after** `astro build` as a separate command, indexing the HTML in `dist/` and writing chunked
index files beside it; the browser downloads only the chunks a query needs. Indexing scope is
controlled with `data-pagefind-body` / `data-pagefind-ignore`, and `data-pagefind-filter` gives
faceted filtering — the right primitive for the regulations reader (filter by document type, then
search within). It exposes both a default UI and a JS API, so it can be driven from a custom design
rather than an imposed one. **[W]**

Two consequences worth planning for:

1. **It is a separate post-build command, so it can silently stop running** and nobody notices for
   months. This is the single test that most earns its keep in the Playwright set.
2. **Turkish is agglutinative**, so stemming matters more than usual — `yönetim`, `yönetimi`,
   `yönetimde` should all match. Pagefind's segmentation is language-aware and keys off
   `<html lang>`. **Test with real inflected queries before assuming it works.** **[W]**

## Test and quality tooling

**Playwright — five tests, maximum.** Every sitemap URL returns 200 with an `<h1>`; no console
errors; the language switcher round-trips between the Turkish and English URLs; the ASCII alias 301s
to the UTF-8 canonical; Pagefind returns results for a Turkish inflected term. Visual-regression
snapshots are a cheap bonus on a design-led site. **[I]**

**Lighthouse CI *and* unlighthouse — not either/or.** They answer different questions:

- **Lighthouse CI** is a *gate*: a fixed list of 3–5 URLs, run per commit, failing the build below a
  threshold. Answers "did this PR make the pages I care about worse?"
- **unlighthouse** is an *audit*: crawls the whole site, produces a sortable dashboard. Answers
  "which of my pages is the worst?" Run manually, quarterly or after a redesign.

An accessibility threshold of 1.0 is reasonable to hold for a civic organization — though Lighthouse
only covers the automatable share of accessibility. Keyboard order, focus visibility, and whether the
language switcher is announced correctly are not in it. **[I]**

## Deployment shape

Static output → the VDS, served by Caddy in a rootless Podman container, supervised by systemd, same
as the rest of the stack. Brotli precompression at build time (level 11 offline beats level 4 on
demand), immutable cache headers on `/_astro/*`, revalidating headers on HTML — the latter is not
optional, since prefetch depends on it (see
[`page-transitions-prefetch.md`](page-transitions-prefetch.md)). No adapter needed while static.

Containerizing rather than rsyncing `dist/` pins Caddy's version and config together with the
content. An rsync leaves "which config is on the box right now" unanswerable in three years. **[I]**

**Versioning:** no release branch. Release branches maintain old versions of shipped software that
cannot be updated; a website has exactly one version in production. Trunk-based with protected
`main`, CalVer deploy tags, and the build SHA embedded in the output so a bug report names a commit.
Rollback is the previous image SHA. **[I]**

## Open for research

- [ ] Pagefind's Turkish stemming quality — empirical, needs a built index.
- [ ] Whether `astro-icon` and `@fontsource-variable/*` have Astro 7 / Vite 8 compatible releases.
      The Astro 7 upgrade notes warn that plugins depending on Vite internals need validating. **[G]**
- [ ] Keystatic multi-locale support status — the single blocker on an otherwise good fit. **[W]**
