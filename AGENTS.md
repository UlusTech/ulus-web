# ulus-web

Landing site for **Ulus**, a Turkish non-profit umbrella organization. Astro 7, static output,
Turkish-primary with English as a co-equal translated mirror. One repo, one deployment.

---

## Read before doing anything

| File | What it is |
| ---- | ---------- |
| [`research/ai/PLAN.md`](research/ai/PLAN.md) | The decision record. What we are building, what was rejected and why, what each decision closes off, the subtask list. **Start here.** |
| [`research/ai/README.md`](research/ai/README.md) | Index of the research files, the provenance-marker convention, and the open-research queue. |
| `research/ai/*.md` | One file per topic. Sourced, dated, version-pinned. |

Everything under `research/ai/` was written by an AI agent — the plan included. It is candidate
material, not ground truth. Decisions live in `PLAN.md`, evidence lives in the topic files. Do not
restate a decision inside a topic file, and do not re-argue one `PLAN.md` records as decided with a
date — those are Bilgehan's calls. If new evidence overturns one, say so plainly and let him change
it.

## Working arrangement

**Bilgehan writes the code. Agents research, verify, and review.**

- No implementations, no paste-ready snippets, no "here's the fix" patches.
- A minimal shape sketch is fine when the shape *is* the answer to a design question — label it a
  sketch. Config examples in research files are for reasoning about trade-offs, and several have
  already been found wrong against the real schema.
- Reviewing code Bilgehan wrote is in scope, and welcome: name defects, do not rewrite.
- The global rule still applies on top of this: produce a written plan and wait for confirmation
  before any code is written at all.

## Research conventions

`research/ai/` is **candidate** research written by agents. `.context/` is ground truth, promoted
there **only by Bilgehan**. An agent may write `research/`; an agent must not write `.context/`.

Every load-bearing claim carries a provenance marker:

| Marker | Meaning |
| ------ | ------- |
| `[V]` | Verified against a primary source, cited inline |
| `[I]` | Inference from verified facts — reasoning, not a source |
| `[G]` | Gap — not verified, and named as such |
| `[W]` | Asserted by another model and **not** independently checked |

`[W]` exists so pasted model output cannot be laundered into "verified". Another model's claim is not
a source. Anything still `[W]` must be promoted to `[V]` or dropped before it is depended on —
`research/ai/out-of-scope-claims.md` is the holding pen.

When updating a research file: bump its date and say what changed; never silently overwrite a `[V]`
claim, since it was true against a pinned version; and if new findings diverge far enough that
patching would produce a document arguing with itself, **write a new file and mark the old one
superseded**.

## Verification discipline

Astro 7, Biome 2.5.x, and TypeScript 7 are all past most models' training cutoffs. **Do not answer
from memory on any of them.** Use Context7 for library documentation, prefer primary sources to blog
posts, and pin every version-dependent claim with a date — or mark it `[G]`.

## Decisions already made — do not relitigate without new evidence

Full reasoning in `research/ai/PLAN.md` §2 and the linked topic files.

- **Astro 7, `output: 'static'`**, `site: https://ulus.me`. SSR is available per-page via
  `prerender = false` if something ever needs it.
- **Bun** for install, scripts, and build. No Deno.
- **Biome alone.** No ESLint, no Prettier. `astro check` is the real type safety.
- **TypeScript 6.x.** TS 7.0 ships no stable compiler API until 7.1, which breaks the Astro language
  server.
- **Native `@view-transition`, not `<ClientRouter />`.** The script-lifecycle tax is permanent and
  Firefox getting an instant navigation is not a defect.
- **Hand-rolled i18n from a segment map.** Astro's built-in i18n and its official i18n recipe are
  both prefix-based; this site uses translated segments with no locale prefix.
- **Canonical URLs are UTF-8** (`/üst-yönetim-kurulu`); ASCII folds are aliases that 301 to them.
- **No Tailwind, no UI framework, no GSAP, no Lenis, no SEO wrapper package** — each rejected for a
  stated reason, each cheap to revisit.
- **Trunk-based, no release branch.** CalVer deploy tags, build SHA embedded in the output.

## House style

Turkish is the primary language of the product; the codebase is English. Small
single-responsibility files, never a monolith. Types over interfaces. Zod where external input is
parsed. Configuration externalized, never hardcoded. JSDoc with `{@linkcode}` references. Minimal
inline comments — explain only non-obvious logic.

Accessibility is not optional here: `prefers-reduced-motion` on every animation, `lang` correct on
every page, keyboard navigation actually tested. An organization whose founding claim is *ülke
halkındır* cannot ship a site part of the public cannot use.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
