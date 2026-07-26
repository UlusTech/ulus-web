# Astro stack decisions for ulus-web

**Date:** 2026-07-25
**Repo state at time of writing:** `astro@^7.1.3`, `bun.lock` present, `engines.node >= 22.12.0`,
`tsconfig` extends `astro/tsconfigs/strict`, single page `src/pages/index.astro`, no integrations,
empty `astro.config.mjs`.
**Status:** candidate research. Not `.context/`. Nothing here has been applied to the repo.

Convention used below: **[V]** = verified against a primary source (cited). **[I]** = inference from
verified facts. **[G]** = gap, not verified. **[W]** = asserted by the Claude-web session
(`claude-web-talk.md`) and **not** independently verified here — another model's claim, not a source.

**Amended 2026-07-26** with §6, after the Claude-web exchange and Bilgehan's answers.

---

## 1. Biome vs ESLint + Prettier

### 1.1 The premise "Biome is not type-aware" is stale

Biome v2.0 ("Biotype", June 2025) shipped type-aware lint rules built on Biome's **own type
inference engine**, not on `tsc`. Type-aware rules live in a `types` **domain**; enabling the domain
turns on the Scanner, which builds the module graph and inferred types across the project. **[V]**
— [Biome v2](https://biomejs.dev/blog/biome-v2/),
[Roadmap 2026](https://biomejs.dev/blog/roadmap-2026/)

Coverage numbers the Biome team published for `noFloatingPromises`, measured against
typescript-eslint as the reference implementation:

| Version | Share of typescript-eslint's detections reproduced |
| ------- | -------------------------------------------------- |
| 2.0     | ~75%                                               |
| 2.1     | ~85% (adds getters, call signatures, comma operator) |

**[V]** — [Biome v2](https://biomejs.dev/blog/biome-v2/), [Biome v2.1](https://biomejs.dev/blog/biome-v2-1/)

Current line is **2.5.2** (2026-07-01); v2.5 promoted 70+ rules, some type-aware, and added
cross-file rules over the module graph (`noUndeclaredClasses`, `noUnusedClasses`). Total rule count
crossed 500. **[V]** — [Biome v2.5](https://biomejs.dev/blog/biome-v2-5/)

No published post-2.1 coverage figure exists. **[G]** — treat "85%" as a floor, not a current number.

### 1.2 So the real question is: what is in the missing slice, and does it touch us

The 15% is not a documented list. **[G]** Structurally, an inference engine that is not `tsc` will
lag on exactly the things "complex types" means:

- conditional types, `infer`, deep generic instantiation
- mapped / template-literal types
- declaration-merged and heavily overloaded third-party `.d.ts`
- brands implemented as intersection with a unique symbol — the Ulus house pattern **[I]**

Concrete cases where type info is the *only* thing that catches the bug. These are the
typescript-eslint typed rules with no untyped equivalent:

```ts
// 1. no-floating-promises — Biome ~85%+ [V], tsc-based 100%
async function warm() { /* ... */ }
warm();                      // silently unhandled rejection

// 2. no-misused-promises — async callback in a sync-expecting slot
[1, 2, 3].filter(async (n) => await check(n));   // filters on Promise, always truthy

// 3. no-unnecessary-condition — needs the narrowed type to know the check is dead
declare const slug: string;  // not `string | undefined`
if (slug) { /* ... */ }      // condition can never be false

// 4. restrict-template-expressions
const u = { id: 1 };
`user: ${u}`;                // "user: [object Object]"

// 5. no-unsafe-argument / -assignment / -return — the `any` firewall
const data = JSON.parse(raw);        // any
renderBirim(data);                   // any flows into a typed API unchecked
```

The brand case — where a non-`tsc` engine is most likely to be weaker:

```ts
declare const BirimBrand: unique symbol;
type BirimSlug = string & { readonly [BirimBrand]: true };

const parseBirimSlug = (s: string): BirimSlug | null => /* ... */;

declare function loadBirim(slug: BirimSlug): Promise<Birim>;

const raw: string = Astro.params.slug;
loadBirim(raw as BirimSlug);   // unsound cast — no linter catches this either way
loadBirim(JSON.parse(x));      // `any` — only no-unsafe-argument catches it
```

Note the important asymmetry: **`tsc` itself already rejects most brand violations.** The linter is
only adding value on the `any`-leak and floating-promise axes. Type-aware linting is a *supplement*
to `astro check` / `tsc --noEmit`, not a substitute — and `astro check` runs the real compiler
regardless of which linter is chosen. **[I]**

### 1.3 The `.astro` question, which dominates the type-awareness question

Both tools are weak inside `.astro`, and this is the decisive fact:

- **Biome**: `.astro` (plus `.vue`, `.svelte`) supported since **2.3**, marked **experimental (🟡)**.
  Biome does no language-specific parsing for the framework syntax; formatting may not match
  expectations and "lint rules might not detect some cases". Cross-embedded-language rules are not
  supported yet. Docs recommend `overrides` disabling `useConst`, `useImportType`,
  `noUnusedVariables`, `noUnusedImports` on `.astro` to avoid false positives. **[V]** —
  [Language support](https://biomejs.dev/internals/language-support/),
  [Biome v2.3](https://biomejs.dev/blog/biome-v2-3/)
- **ESLint**: `eslint-plugin-astro` + `astro-eslint-parser` handle the template properly, but for
  typed linting you must point `parserOptions.project` at a `tsconfig.eslint.json`, and virtual
  TypeScript inside Astro components (`**/*.astro/*.ts`) is **excluded from type-aware linting**.
  **[V]** — [eslint-plugin-astro user guide](https://ota-meshi.github.io/eslint-plugin-astro/user-guide/),
  [withastro/astro#11315](https://github.com/withastro/astro/pull/11315)

**Conclusion:** neither tool gives full type-aware linting of `.astro` frontmatter. The type-aware
delta between them therefore applies only to plain `src/lib/**/*.ts` — the smaller half of a landing
site. **[I]**

### 1.4 When does the gap actually bind on *this* repo — answer: not yet

Current `src/` is one file: `src/pages/index.astro`. There is no `src/lib/`. Per §1.3, the
type-aware delta between Biome and ESLint applies **only** to plain `.ts` files, and this repo has
none. For a landing site the `.ts` surface may stay near-empty — content collection schemas, a
couple of URL helpers. So the honest answer to "when does it become a problem for us" is: **it does
not, at the repo's current shape.** **[I]**

Trigger condition, stated so it can be checked later rather than guessed at:

> If `src/lib/**/*.ts` grows past trivial — async data loading, a Discord/API client, branded
> parsers with real control flow — *then* evaluate adding ESLint as a second, narrow, typed-only
> pass over that directory. Not before.

That pass, if it ever happens: `typescript-eslint` `recommendedTypeChecked` scoped to
`src/lib/**/*.ts`, formatting left entirely to Biome (no `eslint-config-prettier` needed — no ESLint
stylistic rules enabled). Additive and reversible. Migrating Biome → ESLint+Prettier wholesale is
not. **[I]**

### 1.5 Recommendation

Stay on Biome, alone. Formatter + linter + import sort in one Rust binary, one config file, no
plugin supply chain — the lower-lock-in choice, and it matches the house toolchain.

Config shape (verified against Biome docs 2026-07-25, **not applied to the repo**):

- The type-aware domain key is **`types`**, under `linter.domains`. Accepted values: `"recommended"`
  (all recommended non-nursery rules in the domain), `"all"` (including nursery), `"none"`. The
  `types` domain enables the inference engine, which costs analysis time. **[V]** —
  [Domains](https://biomejs.dev/linter/domains/)
- `noFloatingPromises` is in the **`nursery`** group and the **Types** domain, and is **not**
  recommended by default — enable it explicitly, or use `"types": "all"`. **[V]** —
  [noFloatingPromises](https://biomejs.dev/linter/rules/no-floating-promises/)
- `.astro` overrides disabling `useConst`, `useImportType`, `noUnusedVariables`, `noUnusedImports`
  are the documented workaround for false positives. **[V]** —
  [Language support](https://biomejs.dev/internals/language-support/)

**[G]** The `overrides[].includes` key name and the exact group each `.astro` false-positive rule
lives in were not re-verified against 2.5.2's schema. Write the real `biome.json` against
`https://biomejs.dev/schemas/2.5.2/schema.json` and let the schema validate it — do not copy a
snippet from this document.

---

## 2. Bun vs Deno as project runtime

### 2.1 The question mostly dissolves for a static site

Landing pages → `output: 'static'` → the runtime exists only at build time: install deps, run
`astro build`, emit `dist/`. Any HTTP server or CDN serves the output. No runtime lock-in either
way. **[I]**

### 2.2 Astro's own position

- **Bun**: Astro documents a Bun recipe but states it is experimental and "may reveal rough edges;
  some integrations may not work as expected". **[V]** —
  [Use Bun with Astro](https://docs.astro.build/en/recipes/bun/)
- **Deno**: the SSR adapter moved from Astro to Deno; `@deno/astro-adapter` is maintained by Deno's
  core team, built and tested against Deno 2.x. **[V]** —
  [Deno adapter guide](https://docs.astro.build/en/guides/integrations-guide/deno/),
  [denoland/deno-astro-adapter](https://github.com/denoland/deno-astro-adapter)
- **[G]** Whether `@deno/astro-adapter` supports Astro **7** specifically is unverified; sources
  reference Astro 6.

### 2.3 The concrete Bun hazard for this repo: sharp

`astro:assets` uses **sharp** as the default image service. Bun + sharp has a documented
`MissingSharp` failure mode. **[V]** — [Images](https://docs.astro.build/en/guides/images/),
[MissingSharp](https://docs.astro.build/en/reference/errors/missing-sharp/),
[oven-sh/bun#6087](https://github.com/oven-sh/bun/issues/6087)

A landing site is image-heavy by definition, so this is on the critical path, not a corner case.
Mitigations: install `sharp` explicitly, or set `image.service` to the passthrough service and
pre-optimize assets outside the build. **[V]** Test before committing.

Also note the repo currently contradicts itself: `bun.lock` exists but `engines.node >= 22.12.0` is
declared. Astro 7's floor is Node 22. Pick one story and make CI match it. **[V]** —
[Astro 7.0](https://astro.build/blog/astro-7/)

### 2.4 Recommendation

Bun for install + scripts, Node-compatible output, no Deno. Reasons:

1. Runtime is build-time-only for a static site — the decision is cheap and reversible. **[I]**
2. Bun is already the house runtime; a second runtime is a second thing to keep alive.
3. Your objection to Deno's direction is a legitimate input and there is no counterweight strong
   enough here to override it — Deno's only structural advantage (a first-party-maintained SSR
   adapter) is irrelevant while `output: 'static'`.
4. `dist/` is plain static files. Zero lock-in. If Bun's rough edges bite, `bun` → `node`/`pnpm` is
   a one-line CI change.

**Verify before committing:** `bun run build` with one `<Image />` on the page. If sharp fails, that
alone is grounds to run the build under Node while keeping Bun for local scripting.

---

## 3. Tooling and packages

Filtered by the lock-in test: does removing it later require rewriting content or markup?

**Core, first-party, low lock-in:**

| Package                | Purpose                            | Notes |
| ---------------------- | ---------------------------------- | ----- |
| `@astrojs/sitemap`     | `sitemap-index.xml` + hreflang     | Requires `site` in config. Has an `i18n` option emitting `xhtml:link` alternates. **[V]** |
| `astro:assets`         | image optimization, built in       | needs sharp — see §2.3 |
| `@astrojs/rss`         | feeds, if any birim publishes      | first-party |
| Content Collections    | typed frontmatter via Zod schemas  | built in; Zod is already house style |
| `astro:i18n` + `i18n:` | Turkish/English routing            | `prefixDefaultLocale` and `redirectToDefaultLocale` must be set explicitly since v6 **[V]** |

`site` is load-bearing: without it, canonical URLs and the sitemap are wrong or absent. **[V]** —
[Configuring Astro](https://docs.astro.build/en/guides/configuring-astro/)

**Deliberately not recommended:**

- Tailwind — a landing site with a fixed design system does not need a utility framework; scoped
  styles in `.astro` plus CSS custom properties are less to remove later. Cheap to add if the design
  volume justifies it.
- Any UI framework integration (React/Vue/Svelte) — no islands are implied by landing pages.
  Adding one turns a zero-JS site into a hydration site.
- SEO meta wrapper packages — a ~30-line `<SEO />` component owning title/description/canonical/OG/
  JSON-LD is smaller than the dependency and is exactly the "protocol over implementation" call.

---

## 4. Site architecture

### 4.1 Baseline

```js
// astro.config.mjs — proposal, NOT applied
export default defineConfig({
  site: 'https://ulus.me',
  output: 'static',
  trailingSlash: 'always',
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  integrations: [sitemap()],
});
```

`trailingSlash` must be decided once and never changed — it is a URL identity decision; flipping it
later means redirects for every indexed page. **[I]**

### 4.2 SEO

Static output already wins the mechanical half (no hydration, full HTML in the first response).
What still has to be hand-built:

- one `<SEO />` layout component: `<title>`, meta description, `<link rel="canonical">` from
  `Astro.site` + `Astro.url.pathname`, OG/Twitter tags, `<html lang>`
- JSON-LD `Organization` on the root and per-birim pages — this is the highest-leverage SEO artifact
  for an umbrella org with sub-units, since it expresses the birim structure to crawlers **[I]**
- `hreflang` alternates — free via `sitemap({ i18n })` **[V]**
- `public/robots.txt` pointing at `/sitemap-index.xml`

### 4.3 Prefetch

- Default strategy for `data-astro-prefetch` links is `hover`. **[V]**
- Configurable via `prefetch.defaultStrategy`; `'viewport'` prefetches on entry into viewport. **[V]**
- When `<ClientRouter />` is present, prefetch is **automatically enabled** with `prefetchAll: true`.
  **[V]** — [Prefetch](https://docs.astro.build/en/guides/prefetch/)

For a handful of landing pages, `prefetchAll: true` + `hover` is right: bounded page count, so
prefetching everything is not wasteful, and `hover` avoids burning bandwidth on viewport scroll.
**[I]**

### 4.4 Page transitions — the actual decision

Two mutually exclusive options. `<ClientRouter />` is explicitly documented as **not compatible with
native browser MPA routing**. **[V]** — [astro:transitions reference](https://docs.astro.build/en/reference/modules/astro-transitions/)

**Option A — native cross-document, zero JS:**

```css
@view-transition { navigation: auto; }
```

- Requires same-origin navigation; `navigation: auto` covers `traverse`/`push`/`replace` initiated
  from page content. **[V]** — [MDN @view-transition](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@view-transition)
- Not Baseline. Chrome/Edge 126+, Safari 18.2+. **Firefox: same-document shipped in 144;
  cross-document still not shipped** as of mid-2026, possibly Interop 2026. **[V]** —
  [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@view-transition),
  [caniuse](https://caniuse.com/cross-document-view-transitions)
- Degrades cleanly to an instant navigation. Zero JS. Zero dependency. Removing it is deleting four
  lines.

**Option B — `<ClientRouter />`:** intercepts navigation and does a same-document swap, so it uses
the *same-document* View Transition API — which **Firefox 144+ does support**. That is the one real
functional argument for it: Firefox users get transitions. **[V]** It also brings free prefetch,
`transition:name`/`transition:animate` directives, and lifecycle events.

Cost of B: ships a client router, swaps the document instead of navigating it, and makes script
lifecycle your problem — every third-party script and every `<script>` must be re-initialized on
`astro:page-load`. **[I]** That is a permanent tax on every future page.

**Recommendation: start with A.** Firefox users get instant navigation, which is not a defect. The
site stays zero-JS, which is the thing that actually makes it fast and the thing that makes it
outlast us. Revisit B only if a design requires a shared element morphing across pages
(`transition:name` on a logo, say) — that is genuinely hard without it. Prefetch does not require B;
set it explicitly in config.

Failure mode of A: none functional; only aesthetic degradation in Firefox.
Failure mode of B: a script that forgets `astro:page-load` breaks after the first navigation, and
the bug does not reproduce on a hard reload. That class of bug is expensive.

### 4.5 Animation

CSS-only is enough for a landing site, and the primitives now exist without JS:

- scroll-driven animations: `animation-timeline: view()` / `scroll()`
- entry effects: `@starting-style`, `transition-behavior: allow-discrete`
- `IntersectionObserver` + a class toggle (~15 lines) when a scroll-driven fallback is needed

**[G]** Browser support for scroll-driven animations in Safari/Firefox as of July 2026 is not
verified here — check before relying on it as the sole mechanism rather than as an enhancement.

Every one of these must be wrapped in `@media (prefers-reduced-motion: reduce)`.

---

## 5. Lenis and GSAP

### 5.1 GSAP

100% free including all former Club plugins (SplitText, MorphSVG, DrawSVG, ScrollTrigger,
ScrollSmoother) since April 2025, under Webflow; plugins are in the main GitHub repo and npm
package. **[V]** — [Webflow blog](https://webflow.com/blog/gsap-becomes-free),
[GSAP 3.13](https://gsap.com/blog/3-13/)

Note "free" ≠ open protocol — it is a single-vendor library owned by a company that acquired it.
That is a lock-in surface even at zero price, because everything you author lives in GSAP's
timeline API rather than in CSS. **[I]**

Verdict: **do not add for a landing site.** ~70 KB (core + ScrollTrigger) of JS on a site whose
selling point is that it has no JS. Add it only for a specific effect that provably cannot be done
in CSS — a real timeline with sequencing and scrub control, SVG morphing, `SplitText` character
animation. If you do, load it on the one page that needs it, never in the shared layout.

### 5.2 Lenis

Claim contested in the sources: Lenis markets itself as using no CSS transforms and no hijacked
scrollbars **[V, vendor claim]** — [lenis.dev](https://www.lenis.dev/) — while third-party writeups
describe it as lerping a scroll position that other features then read incorrectly, and document a
hard conflict with CSS `scroll-snap`. **[V, third-party]** —
[raoulcoutard.com](https://raoulcoutard.com/posts/2026-02-03-lenis-scrollsnap-conflict-en/)

I am not resolving that contradiction; the operational point stands either way: Lenis takes
ownership of a behavior the browser already owns. What becomes your problem: `prefers-reduced-motion`
(must disable it entirely — vestibular disorder territory), anchor jumps, scroll restoration on back
navigation, `scroll-snap`, and interaction with page transitions. **[V/I]**

Verdict: **no.** Smooth scrolling is a taste preference imposed on every visitor, including ones
whose OS setting explicitly asks for less motion. `scroll-behavior: smooth` in CSS covers anchor
navigation, which is the only case where the browser default is genuinely worse.

If a specific design absolutely requires it, gate it: `matchMedia('(prefers-reduced-motion: reduce)')`
→ do not initialize.

---

---

## 6. Deltas — 2026-07-26

Amendments after the Claude-web exchange (`claude-web-talk.md`) and Bilgehan's stated requirements:
Astro 7, Bun for everything, Figma Pro (not Penpot), and Turkish-primary URLs with **translated route
segments and no `/en/` prefix**.

### 6.1 Decisions now settled, no longer open

| Question | Settled as | Note |
| -------- | ---------- | ---- |
| Astro version | 7.x | greenfield, no legacy plugins |
| Runtime | Bun for install + scripts + build | see §6.5 |
| Linter | Biome alone (§1.5) | unchanged |
| Page transitions | native `@view-transition` | Claude-web initially recommended `<ClientRouter />`, then reversed to agree — §4.4 stands |

### 6.2 i18n — §3's recommendation is superseded

`astro:i18n` solves **locale prefixing** (`/es/…`). Bilgehan's requirement is **translated route
segments** (`/üst-yönetim-kurulu/…` ↔ `/the-high-assembly/…`) with no prefix. Different problem.

Verified constraints:

- **`i18n.domains` requires `output: "server"` plus an adapter, "with no prerendered pages".** Its
  documented limitations: `site` mandatory, `output` must be `"server"`, no individual prerendered
  pages. **[V]** — [Internationalization](https://docs.astro.build/en/guides/internationalization/),
  [Config reference](https://docs.astro.build/en/reference/configuration-reference/)
- So `ulus.org.tr` / `ulus.org.uk` as locale domains is **off the table while static**. Do it as N
  static builds of one repo with `site` + default-lang as build-time env vars. **[I]**
- **[G]** Context7 nests that same limitations block under a "Custom locale paths" heading. The
  listed constraints match `domains` exactly, so this is most likely a heading-nesting artifact and
  custom locale *paths* remain static-safe — but confirm against the rendered docs page before
  relying on either reading. Does not change the recommendation.

**Recommendation:** hand-roll the segment map + a `[...path].astro` catch-all with `getStaticPaths`.
Astro's built-in i18n is not the instrument for this. **[I]**

Consequence §3 got wrong: `@astrojs/sitemap`'s `i18n` option emits `hreflang` alternates by matching
**path prefixes** (`/es/`, `/fr/`). With translated segments there is no prefix to match, so that
option does not apply — **`hreflang` and `x-default` become hand-rolled in the `<SEO />`
component.** **[I]** Sitemap still earns its place for URL enumeration.

### 6.3 TypeScript 7 / tsgo — not yet

TS 7.0 GA'd 2026-07-08 (Go port, ~10x typecheck). **7.0 ships without a stable programmatic compiler
API; that lands in 7.1, expected ~October 2026.** Framework template type-checkers that embed the
compiler API — Volar (Vue, MDX, **Astro**), the Svelte language server, Angular — break. **[V]** —
[TypeScript 7 release coverage](https://typescriptpro.com/blog/typescript-version-7-2026-07-08),
[byteiota](https://byteiota.com/typescript-7-go-native-compiler/)

`astro check` runs the Astro language server, which is exactly such a consumer. **Stay on TS 6.x.**
Astro 7's Rust `.astro` compiler already delivers the build-speed win; TS 7 would only accelerate
`astro check`, ~2s on a landing site. Revisit at TS 7.1 + an `@astrojs/language-server` support
announcement. Current `tsconfig` already extends `astro/tsconfigs/strict`, which pre-adapts to most
of 7.0's new defaults. **[I]**

### 6.4 Prefetch — cache headers are load-bearing, with one correction

Verified from the Astro prefetch docs **[V]** — [Prefetch](https://docs.astro.build/en/guides/prefetch/):

- **Safari** does not support `<link rel="prefetch">` and falls back to `fetch()`, which needs
  `Cache-Control`, `Expires`, `ETag`. `ETag` is non-functional in private browsing.
- **Firefox** *does* support `<link rel="prefetch">` but needs explicit `Cache-Control`/`Expires` or
  it throws **`NS_BINDING_ABORTED`**. With a valid `ETag` the response is still reusable.
- Static/prerendered pages usually get `ETag` automatically from the deploy platform — but **we are
  self-hosting behind Caddy, so this is ours to set.** Without it prefetch is a silent no-op for a
  chunk of traffic.

Correction to the Claude-web text: it attributed `NS_BINDING_ABORTED` to Safari. Per the docs that is
the **Firefox** failure mode; Safari's issue is the `fetch()` fallback needing cache headers.

**[W]** `security.csp: true` + `experimental.clientPrerender: true` producing a CSP violation on the
injected inline speculation rules — plausible (the flag does inject a
`<script type="speculationrules">`) but **not verified**. Test before enabling both.

`clientPrerender` is experimental and Chromium-only; its `eagerness` option (`immediate` / `eager` /
`moderate` / `conservative`) follows the Speculation Rules API. **[V]** Defer it — get
`prefetchAll: true` + `hover` + correct cache headers working first.

### 6.5 Bun + sharp — probed, largely resolved

Probed in this repo on 2026-07-26, non-mutating:

```
node_modules/sharp present; `bun -e 'require("sharp")'` → sharp 0.35.3 loaded ok
```

sharp resolves and loads natively under Bun here, so the documented `MissingSharp` failure does not
reproduce on this machine. **[V, local]** This is strong but not conclusive — it proves module
resolution, not that `astro build` completes an image transform. The full `<Image />` build test
stays as subtask 1. Verdict: **Bun for everything, as requested**, and drop or demote the
`engines.node` field so the repo tells one story.

### 6.6 Out of scope for this repo

- **MinIO / Garage / SeaweedFS object storage.** That is `ulus-haber-api` infrastructure. The
  Claude-web claims (MinIO community edition archived Feb 2026, AGPL, maintenance mode; Garage and
  SeaweedFS as alternatives) are **[W]** and belong in a separate research doc before anything is
  built on them. Not verified here.
- **Bun's Rust rewrite** (`unsafe` block counts, canary status, v1.4). **[W]** Does not move the
  decision: static output means the runtime exits when CI ends. The only thing that could have
  changed the answer was sharp — §6.5 settled it empirically.
- **Deno LTS discontinuation, Cloudflare's acquisition of the Astro team.** **[W]** Context for
  conclusions already reached in §2 and §4; not re-verified.

### 6.7 Do not copy the snippets in `claude-web-talk.md`

Two concrete errors in its JSON-LD block, both worse-than-absent in production structured data:

- `"nonprofitStatus": "Nonprofit501c3"` — a **US IRS** designation. Ulus is a Turkish *federasyon*.
- `"foundingDate": "2023"` — invented; that fact is not established anywhere.

Same rule as §1.5 applies to every snippet in that file: treat as sketch, validate against the real
schema before writing.

---

## Open questions

1. **One repo, many landing pages, or one repo per birim?** *(asked twice, still unanswered — now
   blocks two decisions: repo structure, and whether Tailwind earns its place.)* Six birimler. This
   decides content-collections-plus-dynamic-routes vs a shared package and N sites.
2. **Canonical slug form: `üst-yönetim-kurulu` or `ust-yonetim-kurulu`?** UTF-8 paths are legal and
   percent-encode on the wire; the risks are display in older systems and the Turkish dotless-`ı`
   casing trap (`toLowerCase()` misbehaves — hardcode slugs in the segment map, never generate
   them). **[W/I]** If ASCII is canonical with a redirect from the pretty form, note that static
   output emits no real 301s without host support — that redirect map lives in the **Caddyfile**,
   which splits the route table across two files. Decide once; it is as permanent as `trailingSlash`.
3. **`ulus.me` or `ulusgroup.org` as `site`?** Canonical URL identity.
4. **`ulus.me/haber` vs `ulus.news`** — which is canonical? Same content on two domains without
   `<link rel="canonical">` is the classic duplicate-content own-goal.
5. **Anything ever server-rendered?** A contact form is the likely trigger. Alternative that keeps
   the site fully static: POST to `haber-api` from the browser.

## Gaps to close before implementation

- Biome 2.5.2 `overrides[].includes` schema key and the group of each `.astro` false-positive rule
  (`types` domain key itself is now verified — §1.5)
- Whether custom locale *paths* (as distinct from `i18n.domains`) are static-safe — §6.2 **[G]**
- `security.csp` + `clientPrerender` interaction — §6.4 **[W]**
- scroll-driven animation support in Safari/Firefox as of 2026-07
- `@deno/astro-adapter` Astro 7 compatibility (moot unless §2.4 is reversed)
- post-2.1 Biome type-inference coverage figure (none published)
- Figma Pro: Variables REST API is **[W]** claimed Enterprise-only, with native DTCG export/import in
  the UI on lower tiers. Verify before designing the token pipeline around either path.
