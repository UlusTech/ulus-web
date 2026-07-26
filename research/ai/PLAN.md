# ulus-web — build plan

**Date:** 2026-07-26 · **Status:** awaiting confirmation. Nothing implemented.
**Research backing:** the topic files in this directory — see [`README.md`](README.md).
**Written by an AI agent**, like everything in `research/ai/`. It is a candidate decision record, not
ground truth: Bilgehan owns which parts are real. Decisions here that he has confirmed are marked as
decided with a date.

---

## 1. What we are building

A single Astro 7 repo producing one static site at `ulus.me`: a landing surface for Ulus and each
birim, plus the regulations reader. Turkish-primary, English as a co-equal translated mirror — no
`/en/` prefix; route segments themselves are translated (`/üst-yönetim-kurulu/bilgehan` ↔
`/the-high-assembly/bilgehan`) from one content source. Zero client JavaScript by default; page
transitions via the native CSS `@view-transition` at-rule; navigation felt-instant via Astro's
prefetch plus a first-response budget under ~14 kB. Output is a folder of HTML served by Caddy in a
rootless Podman container on the VDS. Content lives in git as Markdown validated by Zod through
content collections. Every page also emits a `.md` twin for `llms.txt` and the regulations reader.

## 2. Why this approach — and what we are rejecting

**One repo, one deploy** over six repos with a shared design package. Ulus's thesis is that the
birimler are one organization; the URL structure should say so. Six repos buys independent release
cadence that nobody has asked for, and costs a versioned shared package, six pipelines, and six
chances to drift. Split a birim out when it demonstrably needs its own cadence — not before.

**Native `@view-transition` over `<ClientRouter />`.** ClientRouter turns the MPA into an SPA to
reach the same-document View Transition API, which Firefox 144+ supports where cross-document is
still missing. Rejected because the script-lifecycle tax is permanent: under ClientRouter every
`<script>` must be re-runnable on `astro:page-load` forever, and forgetting produces a bug that does
not reproduce on refresh. The failure mode of the native at-rule is that Firefox users get an
instant page change instead of a fade — not a defect. It also contradicts the 14 kB goal to ship a
JS router to animate away loading the site is fast enough not to need.

**Hand-rolled i18n over `astro:i18n`.** Built-in i18n solves *prefixing*; the requirement is
*translated segments*, a different problem. `i18n.domains` is rejected on a hard constraint, not
taste: it requires `output: "server"` with no prerendered pages.

**Biome alone over ESLint + Prettier.** Biome has been type-aware since v2.0 (own inference engine).
Neither tool does type-aware linting inside `.astro` anyway — Biome's `.astro` support is
experimental, and ESLint's typed linting explicitly excludes `**/*.astro/*.ts`. The delta applies
only to plain `.ts`, of which this repo currently has none. `astro check` is the real type safety.

**TypeScript 6.x over TS 7 / tsgo.** TS 7.0 ships no stable programmatic compiler API until 7.1
(~Oct 2026); the Astro language server is exactly such a consumer, so `astro check` breaks.

**No Tailwind at the start.** One site with a fixed design system does not need a utility framework;
`tokens.css` custom properties map to Figma variables with no translation layer. Reversible in ten
minutes — Tailwind v4's `@theme` block consumes the same custom properties.

**Content in git over a CMS.** Keystatic is a real option later; today the team is technical, the
content is small, and Keystatic has no multi-locale support, which §5 makes load-bearing.

**Trunk-based, no release branch.** Release branches exist to maintain old versions of shipped
software you cannot update. A website has exactly one version in production; there is no v1.2 user
needing a backport, so the branch is ceremony. Protected `main`, short-lived feature branches,
squash-merge on green CI, merge → build → deploy. Semver is also wrong here — it communicates API
compatibility and a site has no API. Instead: **CalVer deploy tags** (`2026.07.26`, `-2` for the
second deploy that day) and the **build SHA embedded in the output**, exposed at `/version.json`, so
a bug report names a commit. Rollback is `podman run` with the previous image SHA — subtask 14
already provides it. Add a `staging` branch only when a non-technical person actually needs to
approve content before it goes live; that is a review need, not a release need.

## 3. What this closes off

- **`i18n.domains` is gone for good while static.** `ulus.org.tr` / `ulus.org.uk` will have to be N
  static builds of this repo with `site` + default-lang as build-time env vars. Parked by decision.
- **Shared-element morph across pages** (a logo flying from header into hero) is not available from
  the native at-rule in Firefox. Reversing to ClientRouter later means auditing every script.
- **The slug form is permanent.** Same class of decision as `trailingSlash`: changing it after
  indexing means redirects for every URL. Decided: UTF-8 canonical, ASCII alias 301s to it. The
  consequence to accept is that **part of the route table lives in the Caddyfile**, not in Astro —
  static output emits no real 301s without host support. Mitigated by generating the redirect block
  from `segments.ts` at build time (subtask 4a) so the two can never drift.
- **Hand-rolled i18n means hand-rolled `hreflang`.** `@astrojs/sitemap`'s `i18n` option matches path
  *prefixes*; with translated segments there is no prefix, so `hreflang` and `x-default` live in the
  `<SEO />` component. We own that correctness.
- **Fully static closes off Actions and Server Islands** until an adapter is added. A contact form
  either POSTs to `haber-api` from the browser, or flips one page to `prerender = false`.

## 4. Subtasks

Each is one focused session with a stated done-condition. Order matters — 1 and 2 gate everything.

| # | Goal | Done when |
| - | ---- | --------- |
| 1 | **Settle Bun + sharp empirically.** One real asset, `<Image />`, `bun run build`. | Build emits optimized variants, or the Node-for-build fallback is recorded in CI config. `engines.node` demoted so the repo tells one story. |
| 2 | **Baseline config.** `site`, `output: 'static'`, `trailingSlash`, `prefetch`, `build.inlineStylesheets`, `@astrojs/sitemap`. | `bun run build` emits `sitemap-index.xml` with correct absolute URLs — **canonical UTF-8 routes only; the ASCII aliases from 4a must be excluded**, or we publish duplicate content pointing at our own canonical. |
| 3 | **Biome.** `biome.json` written against the **2.5.5** schema (the installed version — the override block was verified against it by running the binary, `linting-biome-astro.md` §6), `types` domain on, `.astro` overrides. | `biome check` clean on a scaffolded page; no false positives in `.astro` frontmatter. |
| 4 | **The i18n segment map + catch-all route.** `src/i18n/segments.ts`, `[...path].astro`, `getStaticPaths`. Slugs hardcoded, never generated (Turkish dotless-`ı` casing trap). | Both `/üst-yönetim-kurulu/bilgehan` and `/the-high-assembly/bilgehan` build from one Markdown file. |
| 4a | **ASCII → UTF-8 redirect map.** Derive the ASCII fold (`ü→u`, `ö→o`, `ş→s`, `ğ→g`, `ç→c`, `ı→i`) from the same `segments.ts` at build time and emit a Caddy redirect block. Generated, never hand-written — a hand-maintained second list drifts from the route table. **The fold is not injective (`ı→i` collides with `i→i`), so the generator must assert no two segments fold to the same ASCII string and fail the build if they do.** | `/ust-yonetim-kurulu/bilgehan` 301s to `/üst-yönetim-kurulu/bilgehan`; a deliberate collision fails the build; adding a segment regenerates the map with no manual step. Verify Caddy writes `Location:` percent-encoded (`/%C3%BCst-y%C3%B6netim-kurulu/…`), not raw. |
| 5 | **`<SEO />` component.** canonical, `hreflang` + `x-default` → Turkish, OG/Twitter, `<html lang>`. | Every route emits a correct canonical and a complete alternate set. |
| 6 | **Root JSON-LD.** `Organization` + `subOrganization` per birim, typed with `schema-dts`. No invented fields — no `foundingDate`, no US `nonprofitStatus`. | Passes the Rich Results test; every asserted fact is one a visitor can see on the page. |
| 7 | **Design tokens from Figma.** Export DTCG JSON → commit → Style Dictionary → `src/styles/tokens.css`. Naming `category/role/variant`. | A token change is a reviewable git diff, not a silent library publish. |
| 8 | **Layout + section components.** `BaseLayout`, `sections/` (Hero, etc.), skip-link, `@view-transition` wrapped in `prefers-reduced-motion: no-preference`. | A landing page is composed from sections, not written bespoke. |
| 9 | **Content collections.** `birimler`, `kisiler`, `mevzuat` with Zod schemas carrying `tr`/`en` fields. | Bad frontmatter fails the build with a useful message. |
| 10 | **`.md` twins + `llms.txt`.** `[...slug].md.ts` route, `/llms.txt` index, permissive robots.txt naming the AI crawlers explicitly. | Appending `.md` to any regulations URL returns clean Markdown. |
| 11 | **Pagefind.** Post-build index, custom UI against the JS API. Verify Turkish stemming with real agglutinated queries (`yönetim` / `yönetimi` / `yönetimde`). | Search returns correct results for Turkish inflections. |
| 12 | **RSS.** `/haber/rss.xml` + per-category via one dynamic route; category slugs in the same segment map; autodiscovery `<link>`s in `<head>`. | Feeds validate; renaming a category is a map edit plus a redirect, not a broken feed. |
| 13 | **Container + Caddy.** Multi-stage build, brotli precompression at level 11, cache headers (`/_astro/*` immutable; HTML `max-age=0, must-revalidate` + ETag). | Prefetch works in Safari and Firefox — headers verified with `curl -I`, not assumed. |
| 14 | **Podman + systemd on the VDS.** Quadlet or generated unit, `loginctl enable-linger`, rollback by previous image SHA. | `systemctl --user restart` serves the new build; previous SHA still runnable. |
| 15 | **Pre-commit + CI.** `simple-git-hooks` + `nano-staged` → `biome check --write` (<2s). `astro check` on pre-push. CI: build, Lighthouse CI gate (perf ≥0.95, a11y = 1.0), first-response byte budget. The 14336-byte figure is folk wisdom until measured — **first pass warns and records the homepage's actual compressed size; the hard gate is set from that baseline.** A gate on an unmeasured number gets `--no-verify`'d within two PRs. | Pre-commit under 2s. CI records `curl -H 'Accept-Encoding: br' … \| wc -c` per build and fails on regression past the agreed baseline. |
| 15a | **Playwright smoke tests.** Five, no more: every sitemap URL returns 200 with an `<h1>`; no console errors; language switcher round-trips `/üst-yönetim-kurulu/bilgehan` ↔ `/the-high-assembly/bilgehan`; the 4a ASCII alias 301s to the UTF-8 canonical; Pagefind returns results for a Turkish inflected term. | All five pass in CI. The Pagefind one is the point — it runs post-build as a separate command, so it can silently stop running and nobody notices for months. |
| 16 | **Accessibility pass.** Tab the whole site with the mouse unplugged: focus order, focus visibility, language switcher announcement, skip-link. | Keyboard-only navigation reaches every interactive element in a sensible order. |

Deferred by decision, not forgotten: Tailwind, Keystatic, GSAP, Lenis, `clientPrerender`, any
adapter, N-domain static builds.

## 5. Open questions

1. ~~Slug form~~ — **decided (2026-07-26):** canonical is **UTF-8**, `/üst-yönetim-kurulu/bilgehan`.
   ASCII (`/ust-yonetim-kurulu/…`) exists as an alias that **301s to the UTF-8 canonical**. See
   subtask 4a. *(Remaining sub-question: should the English side get a redirect too? English
   segments are already ASCII, so there is nothing to alias — assuming no, say so if not.)*
2. ~~`site`~~ — **decided (2026-07-26): `https://ulus.me`.**
3. ~~`ulus.me/haber` vs `ulus.news`~~ — **decided: no `ulus.news` for now.** Revisit if it ships;
   at that point the mirror's articles need `<link rel="canonical">` pointing at whichever is real.
4. **Is a contact form in scope?** Decides whether we stay adapter-free (POST to `haber-api`) or add
   `@astrojs/node` for one route.
5. **Does the regulations reader need faceted filtering?** If yes, `data-pagefind-filter` shapes the
   content schema in subtask 9 — cheap now, a migration later.
6. ~~**Redirect direction**~~ — **this is §5.1, which records it as decided (2026-07-26): ASCII →
   301 → UTF-8.** Left in place rather than deleted because it is your file and the note "asked
   twice, answers pointed both ways" may be recording a real doubt. If the decision holds, strike
   this item; if it does not, strike §5.1 instead. As written the two entries contradict each
   other — one says decided, the other asks for confirmation, on the same day.

## 6. Working arrangement

**Bilgehan writes the code. This side researches, verifies, and reviews.** No paste-ready
implementations. Deliverables from here are: sourced answers to design questions, verification of
version-dependent claims, and review of what gets written — defects, not rewrites.

## 7. Suggested order

1, then 2, then 4. Subtask 4 is the highest-risk piece: everything downstream — `hreflang`, sitemap,
Pagefind, RSS, the 4a redirect map — hangs off the segment map, and it is the one part with no
framework support behind it. Astro's official i18n recipe does **not** solve it — the review of
`src/i18n/*` lives in [`i18n-translated-segments.md`](i18n-translated-segments.md), 2026-07-26: it is
prefix-based and derives language from path segment 0, both of which the translated-segment
requirement rules out. That review has since been extended to cover the `i18n` block now in
`astro.config.mjs` (working tree, uncommitted).
