# research/ai — machine-written research

Everything in this directory was written by an AI agent. It is **candidate** research, not ground
truth. Ground truth lives in `.context/`, and material is promoted there **only by Bilgehan**. An
agent may write here; an agent must not write `.context/`.

Split out of a single `astro-stack-2026.md` on 2026-07-26. That file is gone — its content lives in
the topic files below. Recover it from git history if a claim's original phrasing is ever in
question.

> **Changed 2026-07-26 (sync pass, same day).** The four Figma files had drifted against each other:
> three claimed a different item was the set's highest-value unknown, the same facts were argued from
> scratch in two or three places, and this queue claimed to aggregate every file while carrying 24 of
> the 68 open items. Added the **fact-ownership** table and the dedupe rule that follows from it,
> a **global ranking** that ends the superlative conflict, and the full queue. Surfaced the `[W]`
> definition divergence rather than resolving it — that one is Bilgehan's. **No claim's evidence
> changed and nothing was re-sourced**; what changed is where each fact is argued and how the open
> items are ordered. Two gradings in `figma-plans-and-entitlement.md` were made coherent — a headline
> carrying one `[V]` across two differently-graded claims, and a table row carrying three
> contradictory markers at once. Both are noted in that file.
>
> **Second pass, same day — the rest of the directory.** The first pass covered only the four Figma
> files. Extended the fact-ownership table to all eighteen, and added the rule that decisions belong
> to `PLAN.md` while evidence and revisit-triggers belong to the topic files — `tooling-packages.md`
> was re-arguing four `PLAN.md` §2 decisions and is now reduced to evidence plus triggers. Pinned
> `@astrojs/sitemap` at the installed 3.7.3 in two headers that left it unpinned. Corrected
> `PLAN.md` subtask 3, which named the Biome **2.5.2** schema while the repo runs 2.5.5 and the
> override block was verified against 2.5.5. Flagged `PLAN.md` §5.6, which asks to re-confirm what
> §5.1 records as decided the same day. Extended the `src/i18n/*` review to the `i18n` block now in
> `astro.config.mjs`, which the first review missed. Added a **repo-state divergence** block to the
> queue. Again: no claim's evidence changed and nothing was re-sourced.

---

## Provenance markers

Every load-bearing claim in these files carries one:

| Marker | Meaning |
| ------ | ------- |
| `[V]` | Verified against a primary source, cited inline |
| `[I]` | Inference drawn from verified facts — reasoning, not a source |
| `[G]` | Gap — not verified, and named as such |
| `[W]` | Asserted by a **non-primary source** and not independently checked — another model, a forum post, a pricing tracker, a blog. Not a source. |

`[W]` is the important one. It exists so that unverified assertion cannot be laundered into
"verified" by passing through this directory. Anything still marked `[W]` must be promoted to `[V]`
or dropped before it is depended on.

> **Convention divergence, for Bilgehan to settle.** `CLAUDE.md` defines `[W]` narrowly as *"asserted
> by another model"*. The four Figma files (2026-07-26) use it for any non-primary source — forum
> threads, pricing aggregators, secondary write-ups. The wording above is the **interim** rule
> reconciling them, chosen because the two meanings share the only property that matters (not a
> primary source, must not be depended on) and because inventing a fifth marker would be worse. An
> agent widening a repo convention is not an agent's call to make: either narrow `[W]` back and
> regrade the Figma files' forum-sourced claims, or amend `CLAUDE.md`. Queued below.

## Fact ownership

Every fact in this directory has **one** owning file. This is the rule that stops the next update
re-duplicating what a sync pass just merged.

**A non-owning file may state a conclusion with its marker and a pointer. It may not re-argue,
re-cite, or re-grade it.** Repeating a one-line fact is correct — each file must stay independently
readable. Restating the *argument* for it is the defect.

**Decisions belong to `PLAN.md`, evidence belongs to the topic files.** A topic file that restates
why a decision was taken is the same defect one level up; `CLAUDE.md` names it directly. The
exception is a *trigger* — the condition under which a decision should be revisited. Triggers live
with the evidence, because that is what will be reread when the condition fires.

| Domain | Owner |
| ------ | ----- |
| Route segments, locale determination, slug form, the segment map's five consumers | [`i18n-translated-segments.md`](i18n-translated-segments.md) |
| `site` / `output` / `trailingSlash`, canonical + `hreflang` emission, JSON-LD, sitemap policy, the first-response budget | [`seo-and-baseline-config.md`](seo-and-baseline-config.md) |
| View transitions, prefetch strategy, cache headers | [`page-transitions-prefetch.md`](page-transitions-prefetch.md) |
| Linting — Biome's type-aware story, `.astro` rule overrides | [`linting-biome-astro.md`](linting-biome-astro.md) |
| Formatting — what Biome does and does not touch in `.astro`, the Prettier question | [`formatting-astro-templates.md`](formatting-astro-templates.md) |
| Build runtime, sharp | [`runtime-bun-sharp.md`](runtime-bun-sharp.md) |
| TypeScript version gating | [`typescript-7-readiness.md`](typescript-7-readiness.md) |
| Package selection and rejection, Pagefind, test/quality tooling | [`tooling-packages.md`](tooling-packages.md) |
| Animation primitives, GSAP, Lenis, the reduced-motion rule | [`animation-css-gsap-lenis.md`](animation-css-gsap-lenis.md) |
| Anti-FOUC theming | [`dark-mode-theming.md`](dark-mode-theming.md) |
| Zod at the content boundary | [`zod-content-collections.md`](zod-content-collections.md) |
| Script splitting | [`script-loading.md`](script-loading.md) |
| astro-tips.dev calibration and triage | [`astro-tips-dev-survey.md`](astro-tips-dev-survey.md) |
| Figma — plan tiers, seats, per-capability gating, credentials, downgrade cost | [`figma-plans-and-entitlement.md`](figma-plans-and-entitlement.md) |
| Figma — format mechanics (DTCG, export/import, aliasing, naming), asset export, lock-in | [`figma-tokens-and-assets.md`](figma-tokens-and-assets.md) |
| Figma — editor and agent wiring: MCP server, VS Code, Code Connect, codegen output | [`figma-local-toolchain.md`](figma-local-toolchain.md) |
| Figma — surfaces beyond the design file, plus the topic sweep | [`figma-surfaces-and-sweep.md`](figma-surfaces-and-sweep.md) |
| Parked `[W]` claims awaiting promotion or disposal | [`out-of-scope-claims.md`](out-of-scope-claims.md) |

Three facts are load-bearing in more than one file and are owned by exactly one of them:

| Fact | Owner | Who points at it |
| ---- | ----- | ---------------- |
| `@astrojs/sitemap`'s `i18n` option matches path *prefixes*, so `hreflang` is hand-rolled | `i18n-translated-segments.md` | `seo-and-baseline-config.md`, `tooling-packages.md` |
| ASCII aliases must be excluded from the sitemap | `i18n-translated-segments.md` | `seo-and-baseline-config.md`, `PLAN.md` subtask 2 |
| Every animation opts *in* via `prefers-reduced-motion: no-preference` | `animation-css-gsap-lenis.md` | `page-transitions-prefetch.md`, `dark-mode-theming.md` |

## Index

| File | Topic | Status |
| ---- | ----- | ------ |
| [`linting-biome-astro.md`](linting-biome-astro.md) | Biome vs ESLint + Prettier, type-aware linting, `.astro` lint overrides | settled — Biome alone |
| [`formatting-astro-templates.md`](formatting-astro-templates.md) | Biome formats only `.astro` frontmatter; do we add Prettier for the template | recommendation — no, with named triggers |
| [`runtime-bun-sharp.md`](runtime-bun-sharp.md) | Bun vs Deno, and the sharp hazard | settled — Bun, sharp probed OK |
| [`typescript-7-readiness.md`](typescript-7-readiness.md) | TS 7 / tsgo and `astro check` | settled — stay on 6.x until 7.1 |
| [`i18n-translated-segments.md`](i18n-translated-segments.md) | Translated route segments, no `/en/` prefix | settled approach, unbuilt |
| [`page-transitions-prefetch.md`](page-transitions-prefetch.md) | `@view-transition` vs `<ClientRouter />`, prefetch + cache headers | settled — native at-rule |
| [`seo-and-baseline-config.md`](seo-and-baseline-config.md) | `site`, `trailingSlash`, canonical/`hreflang`, JSON-LD | mostly settled |
| [`animation-css-gsap-lenis.md`](animation-css-gsap-lenis.md) | CSS-first animation, GSAP, Lenis | settled — CSS first, neither library |
| [`tooling-packages.md`](tooling-packages.md) | Packages worth adding, and what to skip | settled |
| [`figma-plans-and-entitlement.md`](figma-plans-and-entitlement.md) | Figma plan tiers, seat types, per-capability gating, PAT/OAuth, non-profit pricing | settled — Variables REST API is Enterprise-only |
| [`figma-local-toolchain.md`](figma-local-toolchain.md) | Dev Mode MCP server (remote vs desktop), Figma for VS Code, Code Connect, codegen output | settled — remote MCP; Code Connect unusable here |
| [`figma-tokens-and-assets.md`](figma-tokens-and-assets.md) | DTCG `2025.10`, Figma's native variable export/import, round-trip asymmetry, Style Dictionary, asset export, lock-in | settled — manual export, committed |
| [`figma-surfaces-and-sweep.md`](figma-surfaces-and-sweep.md) | Figma Sites, Make, plugin escape hatch, webhooks v2, branching, + topic sweep | settled — Sites rejected, sweep queued |
| [`dark-mode-theming.md`](dark-mode-theming.md) | Anti-FOUC inline theme script under native `@view-transition` | shape known, unbuilt, toggle not yet in scope |
| [`zod-content-collections.md`](zod-content-collections.md) | `preprocess` / `transform` / `refine` in collection schemas | applicable when content lands; Zod major unverified |
| [`script-loading.md`](script-loading.md) | Dynamic `import()` in `<script>`, and when not to | technique on file, no subject yet |
| [`astro-tips-dev-survey.md`](astro-tips-dev-survey.md) | What astro-tips.dev is, how stale, which page routes where | survey — decides nothing |
| [`out-of-scope-claims.md`](out-of-scope-claims.md) | `[W]` claims parked: object storage, Bun's Rust rewrite, Deno, Cloudflare/Astro. The Figma block is **adjudicated** and now points at the four files above | **unverified except where marked adjudicated** |

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

Aggregated from **every** file in this directory, Figma and non-Figma alike. If an item appears in a
file's own "Open for research" block, it appears here.

### Global ranking

Ordered by **cost to resolve × what rests on it**, not by consequence alone. This list is the single
authority on priority — a per-file superlative ("highest-value in this file") is scoped to that file
and does not compete with it.

1. **DTCG export/import on Professional** — two minutes in the UI, and `PLAN.md` subtask 7 rests on
   it. Cheapest item with the most riding on it.
2. **Bilgehan's actual seat type** — thirty seconds in account settings. Three files' conclusions
   assume Full seat: the desktop MCP server's Dev/Full gate, the 15/min Tier-1 asset-export row (a
   View/Collab seat makes it 6/**month** and kills the pull entirely), and the rate-limit reasoning
   in the entitlement file §4. Never confirmed — it entered the set as the parenthetical
   "presumably" and was inherited from there.
3. **Figma variable rename identity** — decides whether a token rename is a safe refactor or silently
   orphans a CSS custom property. Not cheap, but nothing downstream is safe until it is known.
4. **Headless/CI execution of Figma plugins** — decides whether the one ungated automation path on
   Pro is automation or a nicer manual button.
5. **Turkish font coverage and `locale="tr"`** — the one place a Figma-side mistake yields a *wrong
   product* rather than an inconvenient workflow.

### Figma — entitlement

- [x] ~~**Is the Variables REST API genuinely Enterprise-gated?**~~ **Resolved 2026-07-26: yes, `[V]`.**
      `file_variables:read`/`write` are Enterprise-plan-only and need a Full seat in an Enterprise
      org. No unattended CI token pull on Pro.
      → `figma-plans-and-entitlement.md`
- [ ] **DTCG export/import on Professional — spot-check on the real account.** Graded `[I]`, not
      `[V]`: the plan-eligibility line names Professional for variable *modes* generally, not for the
      import/export action specifically. **Global rank 1.**
      → `figma-plans-and-entitlement.md` `[I]`
- [ ] **Bilgehan's actual seat type.** Assumed Full throughout, never confirmed. **Global rank 2.**
      → `figma-plans-and-entitlement.md` `[G]`
- [ ] **Headless/CI execution of Figma plugins.** The Plugin API's variables methods carry no stated
      plan restriction `[V]` — the only ungated automation path on Pro. Whether Figma supports
      headless execution at all is unverified. **Global rank 4.**
      → `figma-plans-and-entitlement.md` `[G]`
- [ ] **Organization/Enterprise dollar figures** — sourced from a search aggregation, not a direct
      read of the rendered pricing page. Gating is solid; numbers are not quotable.
      → `figma-plans-and-entitlement.md` `[W]`
- [ ] **Org-private plugin publishing gating** — pattern-consistent with Branching and Code Connect,
      but not confirmed against a dedicated help article the way those two were.
      → `figma-plans-and-entitlement.md` `[G]`
- [ ] **In-app (non-API) library analytics gating** — inferred from the downgrade-loss list on the
      branching article, not fetched from its own feature page.
      → `figma-plans-and-entitlement.md` `[G]`
- [ ] **The literal 403 error string** for a Pro-plan Variables API call. The *gating* is `[V]`; the
      "Limited by Figma plan" phrasing from the original `[W]` claim is not.
      → `figma-plans-and-entitlement.md` `[G]`
- [ ] **Turkey-specific/regional pricing** — not surfaced on any fetched page.
      → `figma-plans-and-entitlement.md` `[G]`
- [ ] **Do REST tokens survive a Pro→Starter downgrade**, or are they revoked outright?
      → `figma-plans-and-entitlement.md` `[G]`

### Figma — tokens, format, assets

- [ ] **Figma variable rename identity.** Does a rename preserve `targetVariableID` across a DTCG
      export, or orphan the derived CSS custom property? **Global rank 3.**
      → `figma-tokens-and-assets.md` `[G]`
- [ ] **Multi-mode export artifact** — a zip, or one JSON per mode? Per-mode and per-collection
      export are confirmed; the artifact's shape is not.
      → `figma-tokens-and-assets.md` `[G]`
- [ ] **Alias failure mode on import** when the referenced collection is absent — broken value,
      dropped alias, or literal?
      → `figma-tokens-and-assets.md` `[G]`
- [ ] **DTCG `2025.10` module breakdown**, file extension, media type, and what was deferred past the
      stable version.
      → `figma-tokens-and-assets.md` `[G]`
- [ ] **Composite token types** (typography, shadows) across Figma → DTCG → Style Dictionary. Weak
      evidence they are the ragged edge in the *toolchain*, not the format — Penpot documents 13
      types including composite Typography `[V]`.
      → `figma-tokens-and-assets.md` `[G]`
- [ ] **Mode count limits per plan** — the Professional-10 / Organization-20 figures are
      secondary-sourced.
      → `figma-tokens-and-assets.md` `[W]`
- [ ] **Images-endpoint 429 behaviour** — forum reports describe throttling far below the published
      15/min with very large `Retry-After` values.
      → `figma-tokens-and-assets.md` `[W]`
- [ ] **Tokens Studio** — licensing, cost, git-sync model, lock-in profile. A named DTCG reference
      implementation `[V]`, otherwise unresearched.
      → `figma-tokens-and-assets.md` `[G]`
- [ ] **Penpot's DTCG version alignment** — its docs call the Format Module "a draft" and name no
      version. Decides whether a Figma → Penpot token migration is lossless.
      → `figma-tokens-and-assets.md` `[G]`
- [ ] **Penpot ↔ Style Dictionary integration** — asserted by secondary sources, absent from Penpot's
      own token docs.
      → `figma-tokens-and-assets.md` `[W]`
- [ ] **Figma → Penpot file migration** — the `.penpot` format and "not a one-click conversion"
      claims are secondary-sourced.
      → `figma-tokens-and-assets.md` `[W]`
- [ ] **Third-party DTCG export plugins** (tokenHaus et al.) — listed in Community, capabilities
      unverified.
      → `out-of-scope-claims.md` `[W]`

### Figma — toolchain

- [ ] **Dev Mode MCP server from WSL2 with `networkingMode=mirrored`.** No Figma primary source
      addresses it; one forum report claims mirrored mode breaks WSL↔VS Code connections entirely.
      Single-source. Sidestepped entirely by the remote server, which needs no loopback.
      → `figma-local-toolchain.md` `[W]`
- [ ] **Microsoft's own WSL2 mirrored-networking docs** — the better primary source for the
      loopback-sharing mechanism than Figma or community forums. Not fetched.
      → `figma-local-toolchain.md` `[G]`
- [ ] **`get_design_context` codegen defaults.** Reported to emit React + Tailwind regardless of the
      framework prompted. Forum-sourced. Decides whether the tool is useful here beyond inspection.
      → `figma-local-toolchain.md` `[W]`
- [ ] **`create_design_system_rules`-style constraint tool** — absent from the primary tool list.
      Confirm whether it is an MCP tool, a prompt convention, or stale.
      → `figma-local-toolchain.md` `[G]`
- [ ] **`@figma/code-connect` CLI reference and config-file schema.** Moot for this repo, would
      matter for a future component-based sub-project.
      → `figma-local-toolchain.md` `[G]`
- [ ] **Figma for VS Code extension in a Remote-WSL window** — no primary statement either way.
      → `figma-local-toolchain.md` `[G]`
- [ ] **Framelink (GLips/Figma-Context-MCP) recency and security review** — stars and licence
      confirmed, last-commit date not.
      → `figma-local-toolchain.md` `[G]`

### Figma — surfaces and the sweep

- [ ] **Turkish font coverage and `locale="tr"` in Figma's renderer** vs browsers. Dotted/dotless
      `ı`, `ş ğ ç ö ü`, silent font fallback, and SVG text outlining as an unfixable downstream
      failure. **Global rank 5.** Not yet researched at all.
      → `figma-surfaces-and-sweep.md` `[G]`
- [ ] **Font licensing** — a font licensed for Figma but not for web self-hosting is a design that
      cannot ship. Resolve before type is chosen.
      → `figma-surfaces-and-sweep.md` `[G]`
- [ ] **Native contrast checking in Figma** — built in, or plugin-dependent? Contrast must hold
      across *every mode*, so a token pair can pass individually and fail in combination.
      → `figma-surfaces-and-sweep.md` `[G]`
- [ ] **Figma Community file licensing** — CC BY attribution obligations on any Community icon set or
      kit shipped on ulus.me. Cheap to check, embarrassing to get wrong.
      → `figma-surfaces-and-sweep.md` `[G]`
- [ ] **Webhook event types** — does `LIBRARY_PUBLISH` exist? The docs defer to a separate Events
      page.
      → `figma-surfaces-and-sweep.md` `[G]`
- [ ] **Webhook signature/passcode verification** — the delivery-authenticity model.
      → `figma-surfaces-and-sweep.md` `[G]`
- [ ] **Plugin API version, sandbox model, org-private plugin gating.**
      → `figma-surfaces-and-sweep.md` `[G]`
- [ ] **Figma Make export artifact format** — export capability is `[V]`; whether it is a zip, and
      the project structure, is not stated in the FAQ.
      → `figma-surfaces-and-sweep.md` `[G]`
- [ ] **AI credit allotments** — the Make FAQ states no figures. The 500/month figure for
      Collab/Dev/View is secondary-sourced; the Full-seat allotment is unknown.
      → `figma-surfaces-and-sweep.md` `[W]`
- [ ] **Figma Sites custom-domain limits and pricing** — not stated on the publish page; the Pro-10 /
      Org-unlimited figures and the "free through 2025" claim are secondary-sourced and the window has
      closed.
      → `figma-surfaces-and-sweep.md` `[W]`
- [ ] **Version history retention per plan** — matters only as a downgrade consideration.
      → `figma-surfaces-and-sweep.md` `[G]`

### Repo state — divergences found 2026-07-26

These are not research gaps; they are places the repo and the research/plan currently disagree.
Recorded here because the queue is the shared surface where that is checkable. All are in the
**working tree, uncommitted** unless noted.

- [ ] **`astro.config.mjs` enables `astro:i18n`** (`prefixDefaultLocale: false`), which `PLAN.md` §2
      rejects and `i18n-translated-segments.md` argues is the wrong instrument. Uncommitted, part of
      the same recipe experiment the review covers. **Bilgehan's call: deliberate, or leftover?**
      → `i18n-translated-segments.md`, addendum
- [ ] **`typescript` is not declared in `package.json`.** Installed at **6.0.3** via
      `@astrojs/check`'s peer range `^5.0.0 || ^6.0.0`. That range excludes 7, so the decision holds
      by accident — but "stay on TypeScript 6.x" is recorded nowhere in the repo, and a resolution
      change would be silent.
      → `typescript-7-readiness.md`
- [ ] **`@astrojs/sitemap` 3.7.3 is installed but not registered** as an integration, and
      `astro.config.mjs` has no `site`. The integration requires `site` and is inert without it.
      Both are `PLAN.md` subtask 2; noted so the installed-but-unwired state is not mistaken for
      done.
      → `seo-and-baseline-config.md`
- [ ] **`engines.node >= 22.12.0` still in `package.json`** while the build runs on Bun — the repo
      tells two stories. Already flagged; `PLAN.md` subtask 1's done-condition requires resolving it.
      → `runtime-bun-sharp.md`
- [ ] **Root `README.md` is still the Astro starter boilerplate** ("Astro Starter Kit: Minimal",
      "Delete this file"). It documents a `src/components/` for "Astro/React/Vue/Svelte/Preact",
      which the project rejects. Committed, not working-tree.
- [ ] **`biome.json` has no `.astro` overrides and no `types` domain** — `PLAN.md` subtask 3. The
      override block is verified working against 2.5.5; it is simply not applied yet, and
      `LanguagePicker.astro:6` is reporting a false positive because of it.
      → `linting-biome-astro.md` §6

### Astro, i18n, and the build

- [ ] **Astro custom locale *paths* — static-safe or not?** The docs' limitations block ("`output`
      must be `server`, no prerendered pages") appears nested under a custom-locale-paths heading in
      Context7's extraction, but the constraints match `i18n.domains` exactly. Almost certainly a
      heading artifact. Confirm against the rendered docs page.
      → `i18n-translated-segments.md` `[G]`
- [ ] **Caddy redirect encoding** — does Caddy emit `Location:` percent-encoded when the target
      contains Turkish characters? Blocks the ASCII→UTF-8 alias map in subtask 4a.
      → `i18n-translated-segments.md` `[G]`
- [ ] **`@astrojs/sitemap` alternates for non-prefix i18n** — is there any supported way to express
      them, or does `hreflang` have to live entirely in `<SEO />`?
      → `i18n-translated-segments.md`, `seo-and-baseline-config.md` `[G]`
- [ ] **`security.csp: true` + `experimental.clientPrerender: true`** — claimed to produce a CSP
      violation on the injected inline speculation rules. Plausible, unverified.
      → `page-transitions-prefetch.md` `[W]`
- [ ] **Do `astro:*` lifecycle events fire under cross-document `@view-transition`?** Decides whether
      the standard `astro:after-swap` theme re-apply is dead code here.
      → `dark-mode-theming.md`, `page-transitions-prefetch.md` `[G]`
- [ ] **Does a theme change mid-transition interact badly with an active cross-document view
      transition?**
      → `dark-mode-theming.md` `[G]`
- [ ] **Has Firefox shipped cross-document view transitions after 144?** Decides whether the native
      at-rule's Firefox story is still "instant navigation".
      → `page-transitions-prefetch.md` `[G]`
- [ ] **Does Astro wrap its own view-transition CSS in a reduced-motion query**, and what is the
      fallback?
      → `page-transitions-prefetch.md` `[G]`
- [ ] **Scroll-driven animation support** (`animation-timeline: view()`) in Safari and Firefox as of
      2026-07. Decides whether it is load-bearing or progressive enhancement.
      → `animation-css-gsap-lenis.md` `[G]`
- [ ] **`@starting-style` and `transition-behavior: allow-discrete`** support, same question.
      → `animation-css-gsap-lenis.md` `[G]`
- [ ] **The Lenis contradiction** — resolve by reading the source, if it ever becomes
      decision-relevant.
      → `animation-css-gsap-lenis.md` `[G]`
- [ ] **`initcwnd` tuning on the VDS** — the claim that raising it to 32 materially helps the
      first-response budget.
      → `seo-and-baseline-config.md` `[W]`
- [ ] **Current guidance on `llms.txt`** — whether it has moved from proposal toward anything a
      search or AI crawler actually honours.
      → `seo-and-baseline-config.md` `[G]`

### Tooling and language versions

- [x] ~~**Biome 2.5.2 config schema** — the `overrides[].includes` key name, and which rule group
      each `.astro` false-positive rule belongs to.~~ **Resolved 2026-07-26 against 2.5.5 by running
      the binary, `[V]`.** `includes` is correct; `useConst`/`useImportType` in `style`,
      `noUnusedVariables`/`noUnusedImports` in `correctness`.
      → `linting-biome-astro.md` §6
- [ ] **Does `prettier-plugin-astro@0.14.1` round-trip an Astro 7 template unchanged?** Plugin is two
      years without a release. Blocks the only path to formatted `.astro` markup in CI or Neovim.
      → `formatting-astro-templates.md` `[G]`
- [ ] **Upstream Biome issue tracking `.astro` template formatting** — does one exist, and is it on
      the roadmap?
      → `formatting-astro-templates.md` `[G]`
- [ ] **The Astro editor-setup sentence** — confirm verbatim and promote `[W]` → `[V]`, or drop.
      → `formatting-astro-templates.md` `[W]`
- [ ] **Has Biome's `.astro` support left experimental status** in any release after 2.5.5?
      → `linting-biome-astro.md` `[G]`
- [ ] **Biome type-inference coverage past v2.1** — no figure published since the ~85%
      `noFloatingPromises` number. Treat 85% as a floor.
      → `linting-biome-astro.md` `[G]`
- [ ] **TypeScript 7.0's breaking-change list** (`strict` default, `module: esnext`, removed flags).
      → `typescript-7-readiness.md` `[G]`
- [ ] **An `@astrojs/language-server` statement on TS 7 support** — that is the actual gate on the
      TS 6.x decision.
      → `typescript-7-readiness.md` `[G]`
- [ ] **Zod major accepted by Astro 7 content collections**, and current `image()` semantics. Zod 4
      changed `preprocess`, error customisation and `refine` enough that a Zod 3 snippet fails
      quietly rather than loudly.
      → `zod-content-collections.md` `[G]`
- [ ] **Does `astro build` complete a real image transform under Bun?** The remaining half of the
      sharp probe — subtask 1's done-condition.
      → `runtime-bun-sharp.md` `[G]`
- [ ] **`astro-icon` and `@fontsource-variable/*`** — Astro 7 / Vite 8 compatible releases?
      → `tooling-packages.md` `[G]`
- [ ] **Pagefind's Turkish stemming quality** on agglutinated forms (`yönetim` / `yönetimi` /
      `yönetimde`). Empirical — needs a built index. Subtask 11's done-condition.
      → `tooling-packages.md`, `i18n-translated-segments.md` `[G]`
- [ ] **Keystatic multi-locale support status** — the single blocker on an otherwise good fit.
      → `tooling-packages.md` `[W]`
- [ ] **`@deno/astro-adapter` and Astro 7** — moot unless the runtime decision is reversed.
      → `runtime-bun-sharp.md` `[G]`

### Conventions and other repos

- [ ] **`[W]` marker scope** — `CLAUDE.md` defines it as "asserted by another model"; the Figma files
      widened it to any non-primary source. Bilgehan's call: narrow the marker and regrade, or amend
      `CLAUDE.md`. See the note under Provenance markers above.
      → this file
- [ ] **Object storage for `ulus-haber-api`** — MinIO's licensing and maintenance status, and whether
      Garage or SeaweedFS is the right successor. Belongs in that repo's research; recorded here only
      because it arrived in the same conversation.
      → `out-of-scope-claims.md` `[W]`
- [ ] **Bun's Rust rewrite** — stability, `unsafe` surface, v1.4 timing. Parked; does not move the
      static-output runtime decision.
      → `out-of-scope-claims.md` `[W]`
