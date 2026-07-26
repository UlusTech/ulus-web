# Figma tokens and assets — what crosses the wire, and in which direction

**Date:** 2026-07-26 · **Status:** research — not yet promoted to `.context/`
**Scope:** what actually moves between Figma and a codebase. Entitlement depth lives in
[`figma-plans-and-entitlement.md`](figma-plans-and-entitlement.md); editor/MCP wiring in
[`figma-local-toolchain.md`](figma-local-toolchain.md). Cross-reference, don't duplicate.

**This file owns format mechanics, asset export, and the lock-in analysis** — see the fact-ownership
table in [`README.md`](README.md). Entitlement verdicts appearing here are one-line restatements with
a pointer, not re-arguments.

Provenance markers per [`README.md`](README.md): `[V]` verified against a primary source cited
inline, `[I]` inference from verified facts, `[G]` gap, `[W]` asserted by a non-primary source and
not independently checked.

> **Changed 2026-07-26 (sync pass, same day):** the plan-availability derivation in §2 and the
> three-factor rate-limit model in §5 were both re-arguments of material the entitlement file owns —
> replaced with the conclusion, its marker, and a pointer. The verbatim quote and the Tier-1 table
> stay, since this file is where they are used. The "single most consequential open question"
> superlative in §3 was competing with two others across the set; scoped to this file and deferred to
> the global ranking in `README.md`. No claim's substance or grading changed.

---

## Answer, up front

The hypothesis this file was written to test — *for a static Astro site with hand-authored CSS,
token sync is the durable half and component codegen is not* — **holds**, and the evidence is
stronger than expected on the token side.

1. **DTCG is no longer a moving target.** The spec reached its **first stable version, `2025.10`, on
   28 October 2025** `[V]`. Committing to it is committing to a stabilised standard, not a draft.
2. **Figma's native DTCG export/import is real, shipped, and documented** `[V]` — and on the
   evidence available it is available on Professional `[I]`.
3. **The automated path stays closed.** The Variables REST API is Enterprise-only (sibling file,
   `[V]`). Export is a right-click in the UI. That is the ceiling on this plan.
4. **Asset export via REST is available on Pro but rate-limited hard** — Tier 1, **15 requests/min**
   `[V]`, with a default that will silently break Turkish text (§5).

---

## 1. The DTCG spec is stable

The Design Tokens Community Group announced the **first stable version, `2025.10`, on 2025-10-28**
`[V]` ([w3.org announcement](https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/)).
This supersedes the older `[W]` framing in [`out-of-scope-claims.md`](out-of-scope-claims.md), which
described DTCG as a "1.0 spec" without a version or date.

Stable-version capabilities named in the announcement `[V]`:

- theming and multi-brand support, including light/dark modes
- modern colour: Display P3, Oklch, and all CSS Color Module 4 spaces
- token relationships: inheritance, aliases, component-level references

Named reference implementations `[V]`: **Style Dictionary**, **Tokens Studio**, **Terrazzo**. Named
implementing tools include **Figma**, **Penpot**, Sketch, Framer, Knapsack, Supernova, zeroheight.

Not established from the announcement `[G]`: the per-module stable/draft breakdown, the file
extension and media type (`.tokens.json` / `application/design-tokens+json` appear in secondary
sources `[W]`), and what was explicitly deferred past `2025.10`.

> **Why this matters here.** `PLAN.md` subtask 7 commits to DTCG as the interchange format. That
> decision now rests on a stabilised spec with a pinned version rather than a draft — a materially
> better footing than when the subtask was written.

## 2. Figma's native DTCG export/import — shipped

Documented on Figma's own help centre `[V]`
([Modes for variables](https://help.figma.com/hc/en-us/articles/15343816063383-Modes-for-variables)).

**Export** `[V]`:

| Action | How |
| ------ | --- |
| One mode | right-click the mode → **Export mode** |
| All modes in a collection | right-click the collection → **Export modes** |

Artifact is JSON in DTCG format `[V]`. Whether the multi-mode export arrives as a zip — asserted in
the earlier `[W]` material — remains **unverified** `[G]`.

**Import** `[V]`, two routes:

1. **Drag-and-drop** eligible JSON files into the Variables view → creates a **new collection with
   one mode per imported file**.
2. Right-click an existing mode → **Import mode** → updates values in place.

**Import is conditional, and this is the part that bites** `[V]`. Variables are only created when a
token:

- appears in **all** imported files, and
- has a supported type with consistent values across those files, and
- matches the same data type.

A token present in only one mode's file is silently not created. `[I]` This makes import far less
forgiving than export, and is the concrete mechanism behind the older `[W]` advice to treat the flow
as one-directional.

**Name normalisation** `[V]`: nested groups are normalised to forward slashes — `color.accent.light`
becomes `color/accent/light`. `[I]` This vindicates `PLAN.md`'s `category/role/variant` naming
choice: the convention Figma normalises *to* is the one the plan already specifies, so no
translation layer is needed on the way in.

**Cross-collection aliases** `[V]`: carried by a `com.figma.aliasData` extension with
`targetVariableID`, `targetVariableSetID`, `targetVariableSetName`, `targetVariableName`. If Figma
can locate a matching variable in a collection you have access to, the value becomes a real alias.
`[I]` The fallback when it cannot — broken value, dropped alias, or literal — is not stated `[G]`,
and this is exactly the failure the earlier `[W]` claim warned about. It remains unverified in its
specifics but the mechanism is now confirmed to exist.

### Plan availability

**Available on Professional `[I]`, not `[V]`.** The eligibility line in the same article, verbatim
`[V]`:

> "Anyone on Education, Professional, Organization, and Enterprise plans can create and use modes
> for variables"

That line is scoped to *modes generally*, not to the import/export action. The inference and its
limits are argued in [`figma-plans-and-entitlement.md`](figma-plans-and-entitlement.md), which owns
entitlement — not repeated here. **Spot-check on the real account before building the pipeline**;
global rank 1 in the queue.

**Mode count limits** `[W]` — secondary sources only, not confirmed against Figma's docs: Professional
10 modes per collection, Organization 20, raised from a previous limit of 4 as part of Schema 2025.
`[I]` If accurate, 10 modes is far beyond what a two-language site with a light/dark axis needs.

## 3. Round-trip asymmetry

| Direction | Mechanism | Status |
| --------- | --------- | ------ |
| Figma → code, manual | UI export to DTCG JSON | `[V]` shipped; Pro `[I]` |
| Figma → code, automated | Variables REST API | `[V]` **Enterprise-only** — closed on Pro |
| Figma → code, automated | in-house plugin via Plugin API | `[V]` ungated; headless/CI execution `[G]` |
| code → Figma, manual | drag-and-drop / Import mode | `[V]` shipped, but conditional (§2) |
| code → Figma, automated | Variables REST write scope | `[V]` **Enterprise-only** |

**The asymmetry is not between read and write — both directions exist manually and both are gated
identically for automation.** `[I]` The real asymmetry is **manual vs automated**: on Pro, a human
right-clicks. That is the whole story, and it is what `PLAN.md` subtask 7 already assumes.

**Renames and deletions** `[G]` — unresolved and worth flagging. `com.figma.aliasData` carries a
`targetVariableID` alongside a `targetVariableName` `[V]`, which implies a stable ID exists
underneath the name `[I]`. Whether a rename in Figma preserves that ID across an export — and
therefore whether a renamed token orphans its `--custom-property` or migrates cleanly — is not
established. **The most consequential open question in this file**, because it determines whether a
token rename is a safe refactor or a silent breakage. Global rank 3 — behind two items that cost
minutes rather than a spike; see [`README.md`](README.md).

## 4. Style Dictionary

`[V]` ([styledictionary.com/info/dtcg](https://styledictionary.com/info/dtcg/)):

- **v4** introduced first-class DTCG support.
- **v5** adopts the DTCG `2025.10` revision as its base format; DTCG JSON is now the **default
  export format** `[W]` (secondary source).
- **Full `2025.10` support is still work-in-progress in v5** `[V]`. Do not assume complete coverage.
- Legacy format uses `value` / `type` / `description`; DTCG uses `$value` / `$type` / `$description`.
  Type definitions move from the uppermost common ancestor group down onto individual tokens `[V]`.
- The bundled converter **cannot** refactor common type values to DTCG types — e.g.
  `"$type": "size"` → `"$type": "dimension"` needs manual adjustment `[V]`.

`[I]` A preprocessor between Figma's export and Style Dictionary may therefore still be needed, not
because the formats disagree in shape but because `$type` vocabularies may not line up. That is a
small, boring, entirely reviewable script — which is consistent with the plan's intent.

**Tokens Studio** `[G]` — not researched to depth this pass. It is a named DTCG reference
implementation `[V]` and it built Penpot's native token support in collaboration with Penpot `[W]`.
Its licensing, cost, and git-sync model remain unverified and are queued.

## 5. Asset export

`[V]` ([REST file endpoints](https://developers.figma.com/docs/rest-api/file-endpoints/)):

| Property | Value |
| -------- | ----- |
| Formats | `jpg`, `png`, `svg`, `pdf` |
| Scale | `0.01`–`4` |
| Image URL expiry | **30 days** |
| Image-fill URL expiry | "no more than 14 days" |
| Oversize handling | images above 32 megapixels are scaled down automatically |
| Failed nodes | returned as `null` in the map (invisible, 0% opacity, or non-existent ID) |

**No WebP or AVIF** `[V]`. `[I]` Irrelevant — Astro's `<Image />` with sharp handles modern formats
downstream. Pull PNG or SVG and let the build do the encoding; that is the correct division of
labour and it keeps Figma out of the delivery path.

### The default that will break Turkish text

**`svg_outline_text` defaults to `true`** `[V]` — text is rendered as **vector paths** rather than
`<text>` elements.

`[I]` For this project that default is actively harmful and must be overridden:

- Outlined text is **not selectable, not searchable, and invisible to screen readers**. CLAUDE.md
  states accessibility is not optional here.
- Turkish diacritics (`ı`, `ş`, `ğ`, `ç`, `ö`, `ü`) become path geometry — unfixable downstream, and
  a rendering error becomes permanent rather than a font swap away.
- It defeats the `.md` twin / `llms.txt` work in subtask 10, which assumes text is text.

`[I]` **The safer rule: do not export text as SVG at all.** Export icons and illustrations; keep
copy in Markdown and CSS where it belongs. If text must ship inside an SVG, set
`svg_outline_text=false` deliberately.

`svg_include_id` (layer names → `id`) and `svg_include_node_id` (→ `data-node-id`) both default to
`false` `[V]`. `[I]` Leave them off; both leak Figma-internal naming into shipped markup, and SVGO
would strip them anyway.

### Rate limits — the real constraint on a CI asset pull

`[V]` ([rate limits](https://developers.figma.com/docs/rest-api/rate-limits/)). The three-factor
model behind these numbers — seat type × endpoint tier × the plan of the *resource*, not the caller —
is documented in [`figma-plans-and-entitlement.md`](figma-plans-and-entitlement.md) §4.

The images endpoint is **Tier 1**, the most restrictive tier `[V]`:

| Plan | View/Collab seat | Dev/Full seat |
| ---- | ---------------- | ------------- |
| Starter | 6/month | 10/min |
| **Professional** | 6/month | **15/min** |
| Organization | 6/month | 20/min |
| Enterprise | 6/month | 20/min |

429 responses carry `Retry-After` (seconds), `X-Figma-Rate-Limit-Type`, `X-Figma-Plan-Tier`,
`X-Figma-Upgrade-Link` `[V]`. Leaky-bucket algorithm `[V]`.

`[W]` Multiple forum reports describe 429s after roughly 10 image requests with very large
`Retry-After` values — worse in practice than the published table suggests. Not independently
verified.

`[I]` **15/min is workable for a landing site's icon set** (tens of assets, pulled once, committed).
It is not workable as an unattended per-build step. The honest conclusion matches the token
conclusion: **pull assets deliberately, commit them, treat the commit as the artifact.** Same
principle as subtask 7 — and note that the 6/month View/Collab figure means seat type, not just
plan, decides whether this is viable at all.

## 6. Do typography and spacing cross as cleanly as colour?

`[G]` for Figma specifically — not resolved this pass.

But the ecosystem evidence points the *opposite* way from what a first pass suggested. Penpot's
documented token types number **13** and explicitly include **Font Family, Font Size, Font Weight,
and Shadow**, plus composite tokens for **Typography, Letter Spacing, Text Case, and Text
Decoration** `[V]` ([Penpot design tokens](https://help.penpot.app/user-guide/design-systems/design-tokens/)).
Composite typography is a solved problem in at least one DTCG implementation.

`[I]` So the ragged edge, if there is one, is Figma-side or Style-Dictionary-side, not inherent to
the format. Style Dictionary's open issues on DTCG `$dimension` output and typography composition
`[W]` suggest the toolchain is where composites fray.

Still not a blocker: `[I]` colour, spacing, and radius carry the design system. Type scale can live
in CSS as it does today, and shipping it as tokens is an optimisation, not a prerequisite.

## 7. Lock-in surface

Stated plainly, as CLAUDE.md requires of any tool decision.

**What exits cleanly** `[V]`: variables, as DTCG `2025.10` JSON, via a documented UI action, into a
stabilised vendor-neutral standard with three independent reference implementations. This is a
genuinely good exit story — better than most SaaS design tooling.

**What does not exit** `[V]`/`[I]`:

- **`.fig` goes nowhere** `[W]` — secondary sources say Penpot's native formats are `.penpot` and
  Penpot-containing ZIPs, and that Figma files, components, variables and prototype links need a
  separate migration rather than a one-click conversion. **Penpot's own token documentation does not
  mention Figma or `.fig` import at all** `[V]`, so this is unverified against a primary source and
  must not be depended on. Directionally it is very likely correct; the specifics are not checked.
- **Automation is plan-gated, not format-gated.** The tokens are portable; the pipeline around them
  is rented. On Pro, automation depends on one human's PAT with a 90-day expiry ceiling (sibling
  file, `[V]`).
- **No self-hosting at any tier** `[V]`.

**Penpot as comparator** `[V]`
([docs](https://help.penpot.app/user-guide/design-systems/design-tokens/)): open-source,
self-hostable, follows the W3C DTCG **Design Tokens Format Module** — its docs describe that module
as "a draft" and name **no version**, so alignment with stable `2025.10` is `[G]`, not established.

- **13 token types**, including the composite typography set (§6).
- **Import/export**: single JSON, multi-file folder (one JSON per token set), and ZIP. Supports
  `$themes.json` and `$metadata.json`. Exports include full token sets and themes.
- **Multidimensional themes** — several active at once, grouped by axis (Mode, Brand, Contrast,
  Platform). `[I]` This is a genuinely richer theming model than a flat mode list, and it maps
  directly onto a hypothetical per-*birim* brand axis crossed with light/dark.
- **Math in token values** (operators plus `round()`, `max()`, `min()`) and token aliasing.
- **Style Dictionary integration is NOT mentioned in Penpot's own docs** `[W]` — asserted by
  secondary sources only. Downgraded from an earlier `[V]`.
- Built in collaboration with Tokens Studio `[W]`.

`[I]` The honest read: **the token layer is not where lock-in lives** — DTCG makes it portable both
ways, and Penpot consumes the same format. Lock-in lives in the *design files themselves*, which do
not move. For ulus-web specifically that exposure is small, because the deliverable is a committed
`tokens.css` in git; the Figma file is an input, not the product. A migration would cost redrawing,
not re-deriving the design system.

> Recorded for accuracy, not as advocacy: `PLAN.md` records Figma as the design tool. Nothing here
> overturns that. The exit cost is simply now stated rather than assumed.

---

## Open for research

- [ ] **Rename identity.** Does a Figma variable rename preserve `targetVariableID` across export, or
      does it orphan the derived CSS custom property? Highest-value unknown in this file. `[G]`
- [ ] **DTCG on Professional — spot-check on the real account.** Now a strong `[I]`, still not `[V]`.
      Two minutes in the UI settles it. `[I]`
- [ ] **Multi-mode export artifact** — zip, or one JSON per mode? `[G]`
- [ ] **Alias failure mode on import** when a referenced collection is absent — broken value,
      dropped alias, or literal? `[G]`
- [ ] **Tokens Studio** — licensing, cost, git-sync model, lock-in profile. Not researched. `[G]`
- [ ] **Penpot's DTCG version alignment** — its docs call the Format Module "a draft" and name no
      version. Whether Penpot targets stable `2025.10` is unestablished, and it decides whether a
      Figma → Penpot token migration is lossless. `[G]`
- [ ] **Penpot ↔ Style Dictionary** — asserted by secondary sources, absent from Penpot's own token
      docs. `[W]`
- [ ] **Figma → Penpot file migration** — the `.penpot` format and "not a one-click conversion"
      claims are secondary-sourced; Penpot's token docs do not mention Figma import. `[W]`
- [ ] **Composite token types** (typography, shadows) across Figma → DTCG → Style Dictionary. `[G]`
- [ ] **DTCG `2025.10` module breakdown**, file extension, media type, deferred features. `[G]`
- [ ] **Mode count limits per plan** — 10/20 figures are `[W]`, secondary-sourced.
- [ ] **Images-endpoint 429 behaviour** — forum reports of throttling far below the published
      15/min. `[W]`

## Claims resolved from `out-of-scope-claims.md`

| Original `[W]` claim | Now |
| -------------------- | --- |
| Variables REST API is Enterprise-only | **`[V]` confirmed** (sibling file) |
| Native DTCG export/import exists, ungated | **`[V]` exists and is documented**; Professional availability **`[I]`**, not `[V]` |
| "aligned with DTCG 1.0 spec" | **corrected** — the spec is `2025.10`, first stable 2025-10-28 `[V]`. There is no "1.0". |
| Rolled out ~December 2025 | **unverified** `[G]` — no rollout date found in primary sources |
| Export per mode yields a zip | **unverified** `[G]` — per-mode and per-collection export confirmed, artifact shape not |
| Import nuanced with two-way aliases | **mechanism confirmed** `[V]` (`com.figma.aliasData`); the specific breakage `[G]` |
| Third-party DTCG plugins exist (tokenHaus et al.) | **`[W]` unchanged** — plugins exist in Community listings, capabilities unverified |
