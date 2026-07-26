# research/ai — machine-written research

Everything in this directory was written by an AI agent. It is **candidate** research, not ground
truth. Ground truth lives in `.context/`, and material is promoted there **only by Bilgehan**. An
agent may write here; an agent must not write `.context/`.

Split out of a single `astro-stack-2026.md` on 2026-07-26. That file is gone — its content lives in
the topic files below. Recover it from git history if a claim's original phrasing is ever in
question.

---

## Provenance markers

Every load-bearing claim in these files carries one:

| Marker | Meaning |
| ------ | ------- |
| `[V]` | Verified against a primary source, cited inline |
| `[I]` | Inference drawn from verified facts — reasoning, not a source |
| `[G]` | Gap — not verified, and named as such |
| `[W]` | Asserted by another model (the Claude-web session) and **not** independently checked. Another model's claim is not a source. |

`[W]` is the important one. It exists so that pasted model output cannot be laundered into "verified"
by passing through this directory. Anything still marked `[W]` must be promoted to `[V]` or dropped
before it is depended on.

## Index

| File | Topic | Status |
| ---- | ----- | ------ |
| [`linting-biome-astro.md`](linting-biome-astro.md) | Biome vs ESLint + Prettier, type-aware linting, `.astro` coverage | settled — Biome alone |
| [`runtime-bun-sharp.md`](runtime-bun-sharp.md) | Bun vs Deno, and the sharp hazard | settled — Bun, sharp probed OK |
| [`typescript-7-readiness.md`](typescript-7-readiness.md) | TS 7 / tsgo and `astro check` | settled — stay on 6.x until 7.1 |
| [`i18n-translated-segments.md`](i18n-translated-segments.md) | Translated route segments, no `/en/` prefix | settled approach, unbuilt |
| [`page-transitions-prefetch.md`](page-transitions-prefetch.md) | `@view-transition` vs `<ClientRouter />`, prefetch + cache headers | settled — native at-rule |
| [`seo-and-baseline-config.md`](seo-and-baseline-config.md) | `site`, `trailingSlash`, canonical/`hreflang`, JSON-LD | mostly settled |
| [`animation-css-gsap-lenis.md`](animation-css-gsap-lenis.md) | CSS-first animation, GSAP, Lenis | settled — CSS first, neither library |
| [`tooling-packages.md`](tooling-packages.md) | Packages worth adding, and what to skip | settled |
| [`out-of-scope-claims.md`](out-of-scope-claims.md) | `[W]` claims parked: object storage, Bun's Rust rewrite, Figma tiers | **unverified — do not depend on** |

Decisions derived from all of this live in [`PLAN.md`](PLAN.md) — also agent-written, and candidate
in the same way. Where it records something as *decided with a date*, that is Bilgehan's call, not
the agent's.

---

## For an agent picking this up

Read this section before touching any file here.

**The standing rule:** Bilgehan writes the code. This directory exists so he can make decisions with
sourced evidence in front of him. Do not produce implementations, and do not turn a research file
into a tutorial. Config shapes appearing in these files are sketches for reasoning about trade-offs,
explicitly not paste-ready — several have already been found wrong against the real schema.

**When updating a file:**

1. Update the date in its header, and say what changed.
2. Never silently overwrite a `[V]` claim with a newer one — the old claim was true against a
   pinned version. Note the version the change applies from.
3. If a claim's marker improves (`[W]` → `[V]`, `[G]` → `[V]`), remove it from that file's
   "Open for research" block and from the queue below.
4. If your findings diverge from a file's conclusion far enough that patching it would produce a
   document arguing with itself, **write a new file** and mark the old one superseded with a link.
   That is what went wrong with the original omnibus doc's §6.

**Verification discipline:** every version-dependent claim gets pinned and dated, or gets marked
`[G]`. Astro 7, Biome 2.5.x, and TypeScript 7 are all past most models' training cutoffs — do not
answer from memory on any of them. Use Context7 for library docs, primary sources over blog posts,
and prefer the project's own docs and changelog to a summary of them.

## Open research queue

Aggregated from every file. Roughly in order of how much rests on it.

- [ ] **Astro custom locale *paths* — static-safe or not?** The docs' limitations block ("`output`
      must be `server`, no prerendered pages") appears nested under a custom-locale-paths heading in
      Context7's extraction, but the constraints match `i18n.domains` exactly. Almost certainly a
      heading artifact. Confirm against the rendered docs page.
      → `i18n-translated-segments.md` `[G]`
- [ ] **`security.csp: true` + `experimental.clientPrerender: true`** — claimed to produce a CSP
      violation on the injected inline speculation rules. Plausible, unverified.
      → `page-transitions-prefetch.md` `[W]`
- [ ] **Biome 2.5.2 config schema** — the `overrides[].includes` key name, and which rule group each
      `.astro` false-positive rule belongs to. The `types` domain key itself is verified.
      → `linting-biome-astro.md` `[G]`
- [ ] **Caddy redirect encoding** — does Caddy emit `Location:` percent-encoded when the target
      contains Turkish characters? Blocks the ASCII→UTF-8 alias map.
      → `i18n-translated-segments.md` `[G]`
- [ ] **Scroll-driven animation support** (`animation-timeline: view()`) in Safari and Firefox as of
      2026-07. Decides whether it is load-bearing or progressive enhancement.
      → `animation-css-gsap-lenis.md` `[G]`
- [ ] **Figma Pro and design tokens** — is the Variables REST API genuinely Enterprise-gated, and is
      native DTCG export/import available on Pro? Shapes the token pipeline.
      → `out-of-scope-claims.md` `[W]`
- [ ] **Object storage for `ulus-haber-api`** — MinIO's licensing and maintenance status, and
      whether Garage or SeaweedFS is the right successor. Belongs in that repo's research, not this
      one, but it is recorded here because it arrived in the same conversation.
      → `out-of-scope-claims.md` `[W]`
- [ ] **Biome type-inference coverage past v2.1** — no figure has been published since the ~85%
      `noFloatingPromises` number. Low priority; treat 85% as a floor.
      → `linting-biome-astro.md` `[G]`
- [ ] **`@deno/astro-adapter` and Astro 7** — moot unless the runtime decision is reversed.
      → `runtime-bun-sharp.md` `[G]`
