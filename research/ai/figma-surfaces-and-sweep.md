# Figma's newer surfaces, and the topic sweep

**Date:** 2026-07-26 · **Status:** research — not yet promoted to `.context/`
**Scope:** Figma products beyond the design file (Make, Sites, plugins, webhooks, branching), plus an
enumerated sweep of Figma-usage topics not covered by the three sibling files. Entitlement depth in
[`figma-plans-and-entitlement.md`](figma-plans-and-entitlement.md); editor/MCP wiring in
[`figma-local-toolchain.md`](figma-local-toolchain.md); tokens and assets in
[`figma-tokens-and-assets.md`](figma-tokens-and-assets.md).

**This file owns the non-design-file surfaces and the topic sweep** — see the fact-ownership table in
[`README.md`](README.md). Gating verdicts here are one-line restatements with a pointer.

Provenance markers per [`README.md`](README.md): `[V]` verified against a primary source cited
inline, `[I]` inference, `[G]` gap, `[W]` non-primary source, not independently checked.

> **Changed 2026-07-26 (sync pass, same day):** §3 claimed the headless-plugin question was "the
> highest-value open question across all four files" while two sibling files claimed the same status
> for different items — scoped to this file and deferred to the global ranking in `README.md`. §5's
> branching gate now points at the entitlement file rather than re-citing it; the workflow analysis,
> which this file owns, is unchanged. No claim's substance or grading changed.

---

## Answer, up front

**Figma Sites cannot export its code** `[V]`. That single fact settles the only question in this file
that could have changed the project's direction. Everything else here is context.

---

# Half one — the newer surfaces

## 1. Figma Sites — the direct competitor to ulus-web

Verbatim from Figma's own help centre `[V]`
([Publish, update, or unpublish a site](https://help.figma.com/hc/en-us/articles/31242845959703-Publish-update-or-unpublish-a-site)):

> "It's not currently possible to export your site's code for external publishing."

This is an explicit statement on Figma's documentation, not an absence of documentation — the
distinction matters, and it makes this a verified negative rather than a gap.

| Axis | Figma Sites | ulus-web as planned |
| ---- | ----------- | ------------------- |
| Code export | **none** `[V]` | the repo *is* the artifact |
| Hosting | AWS in the **United States**, domain/routing via Cloudflare `[V]` | Keyubu VDS, Turkey, Caddy |
| Self-hostable | no `[V]` | yes |
| Publishing | all paid plans; Education limited to one site with bandwidth caps; **edit access to the file required** `[V]` | anyone with git |
| Custom domains | Pro 10 / Org unlimited `[W]` — **not stated on the publish page**, secondary source only | any |

`[I]` This fails Ulus's stated principles on every axis that matters: not self-hostable, not
exportable, hosted in US jurisdiction, and it makes the site un-editable by anyone without a paid
Full seat. For an organization whose founding claim is *ülke halkındır*, publishing the public face
of it onto a surface that cannot be moved or self-hosted is a direct contradiction.

**Recommendation: not a candidate.** `[I]` Nothing in `PLAN.md` needs revisiting — this documents
*why* the alternative was not taken, which was previously unstated.

`[W]`: custom domains free of charge "through 2025", limits subject to change after. Secondary
source, and the date is now past — treat as unknown.

## 2. Figma Make

`[V]` ([Figma Make FAQs](https://help.figma.com/hc/en-us/articles/31722591905559-Figma-Make-FAQs)),
verbatim:

> "Figma Make is an AI-driven, prompt-to-app tool that lets you bring ideas and existing Figma
> designs to life as functional prototypes, web apps, and interactive UI."

- **Export exists — and this is the contrast with Sites** `[V]`: Full seats can "Export code";
  Dev/Collab/View seats can export only when working in drafts. **The artifact format is not stated
  in the FAQ** `[G]` — the "zip from the code view" detail is `[W]`, secondary-sourced.
- **Seat/plan** `[V]`, verbatim: *"Figma Make is included on the Full seat. Users with a Dev, Collab
  or View seat can also try Figma Make in drafts."* Dev/Collab/View can create in drafts only and
  cannot share. Not available to K-12 Education; higher-ed and bootcamp users can access it.
- **Starter** `[V]`: cannot use team libraries for style context; can only publish to the public web
  if also publishing to Figma Community.
- **AI credits** `[G]`: the FAQ defers to a separate "How AI credits work" page and states no
  figures. The **500 credits/month** number for Collab/Dev/View and Starter is `[W]`,
  secondary-sourced; the Full-seat allotment is unknown.

`[I]` **Low relevance here.** Emits React; ulus-web is Astro with no UI framework, by a decision
`PLAN.md` records. Possible use as a throwaway visual sketching tool whose output is read and
discarded, never merged — but that is a workflow preference, not an architectural question.

## 3. Plugin API — the escape hatch

`[V]` (sibling file): the Plugin API's variables methods carry **no stated plan restriction**, which
makes an in-house plugin the only ungated automation path on Pro.

`[I]` Strategically this is the most interesting surface in this file. When a REST endpoint is
plan-gated, a ~50-line plugin reading `getLocalVariablesAsync()` and writing DTCG JSON reaches the
same data with no Enterprise seat. That is a protocolization move in Ulus's own terms: the *format*
is the standard, and the plugin is a thin, replaceable adapter to it.

The catch is unchanged and unresolved `[G]`: plugins run inside a live Figma client. Whether headless
or CI execution is possible at all decides whether this is automation or a nicer manual button.
Global rank 4 — see [`README.md`](README.md); it is outranked by two items that cost minutes.

Plugin API version, sandbox model details, and org-private plugin gating: `[G]`, not researched.

## 4. Webhooks v2

`[V]` ([REST webhooks docs](https://developers.figma.com/docs/rest-api/webhooks/)):

| Scope | Max per scope | Who can create |
| ----- | ------------- | -------------- |
| Team | 20 | team admins only |
| Project | 5 | users with edit permission |
| File | 3 | users with edit permission |

Total **file** webhooks by plan `[V]`: Professional **150**, Organization 300, Enterprise 600.

Delivery `[V]`: return `200 OK`; Figma retries failed deliveries **three times — at 5 minutes, 30
minutes, and 3 hours**. Signature/passcode verification details not established `[G]`. The event-type
list, and specifically whether `LIBRARY_PUBLISH` exists, is `[G]` — the docs page defers to a
separate Events page not fetched this pass.

`[I]` Webhooks are **available on Professional**, unlike almost everything else automation-related.
But the retry schedule (5 min → 30 min → 3 hr) makes them unsuitable as a build trigger for a static
site: a missed delivery means a stale deploy for up to three hours with no polling fallback. `[I]`
For a landing site whose tokens are committed manually anyway, this is a solution without a problem.

## 5. Branching and merging

**Organization and Enterprise only, Full seat. Not available on Pro** `[V]` — gating sourced and
argued in [`figma-plans-and-entitlement.md`](figma-plans-and-entitlement.md) §3.

Workflow `[V]` ([Guide to branching](https://help.figma.com/hc/en-us/articles/360063144053-Guide-to-branching)): create an isolated branch from the main file → edit → request review (collaborators
compare side-by-side or as overlays) → merge, resolving conflicts from concurrent main-file edits
first. Version-history checkpoints are preserved at branch creation, at updates from main, and at
merge.

`[I]` Worth naming because it is the feature people reach for when they want "git for design," and it
is exactly the thing Ulus's git-centred instincts would want. It is not purchasable at this tier.
The substitute is the one `PLAN.md` already chose: **the tokens are in git, so the reviewable diff
lives in the repo rather than in Figma.** The design file stays a single mutable source; only its
extracted output is versioned. That asymmetry is worth accepting consciously rather than discovering
later.

## 6. Slides, FigJam, Draw, Buzz

`[G]` — not researched. `[I]` No bearing on a static marketing site; deliberately skipped rather than
padded. Revisit only if Ulus Media or Ulus Academy needs presentation or whiteboard tooling, which
is a different repo's question.

---

# Half two — the topic sweep

Topics a serious design-system-to-code workflow must answer that the four Figma files do **not**
cover. Priority is for ulus-web specifically. All `[I]` unless marked — this is analysis, not
sourced research, and each is a candidate for its own investigation.

## High priority — these bite this project specifically

**1. Turkish typography and the font pipeline.**
The dotted/dotless `ı`/`i` pair, plus `ş ğ ç ö ü`. Three distinct risks: (a) the font chosen in Figma
may lack full Turkish coverage, and the fallback that silently renders in Figma will differ from the
browser's; (b) `locale="tr"` affects casing and hyphenation in ways Figma does not model — the same
casing trap `PLAN.md` subtask 4 already flags for slugs; (c) any text exported as SVG becomes paths
and is then unfixable — see [`figma-tokens-and-assets.md`](figma-tokens-and-assets.md) §5.
**Highest priority in this list.** It is the one place where a Figma-side mistake produces a *wrong
product*, not just an inconvenient workflow.

**2. Font licensing and self-hosting divergence.**
Figma renders with fonts under Figma's licence; the site must self-host under its own. A design
approved in Figma using a font not licensed for web self-hosting is a design that cannot ship.
Variable-font axis support may also differ between Figma's renderer and browsers. Resolve *before*
type is chosen, not after.

**3. Accessibility annotation and contrast checking.**
CLAUDE.md makes accessibility non-optional. Contrast must be verified at token-definition time, not
discovered at audit. Open question: does Figma have native contrast checking now, or is this
plugin-dependent `[G]`? A related and harder question — contrast must hold **across every mode**, so
a light/dark token pair can pass individually and fail in combination.

**4. Naming conventions that survive the round trip.**
Partly resolved: Figma normalises `color.accent.light` → `color/accent/light` on import `[V]`, which
matches `PLAN.md`'s `category/role/variant`. What remains open is **semantic durability** — the
existing note that `text/gray` breaks the moment a dark theme exists while `text/subdued` does not.
This is a naming discipline, enforced by review, that no tool checks for you.

## Medium priority

**5. Auto-layout → CSS translation fidelity.**
Figma's auto-layout is flexbox-shaped and has no grid equivalent. A design built purely in
auto-layout will not suggest the CSS Grid structures a hand-authored layout should use. Risk is
subtle: the design *implies* an implementation that is not the right one. Mitigation is
organisational — treat Figma output as intent, not as structure.

**6. Multi-brand and theming via modes.**
Directly relevant if the six *birimler* (Ulus Tech, Media, News, Entertainment, Academy, Community)
ever need per-unit colour identity on a shared component set. Modes are the mechanism, mode limits
are the constraint (Pro: 10 per collection `[W]`). Worth designing the collection structure for now,
even though only one brand ships initially — retrofitting modes is harder than reserving the axis.

**7. Handoff and redlining without Dev Mode.**
Dev Mode's entitlement is covered by the sibling file, but the *workflow* question is not: when one
person both designs and implements, formal handoff may be pure overhead. Worth explicitly deciding
to skip rather than adopting by default.

**8. Figma Community file licensing.**
Community files carry varying licences (CC BY, etc.). Any icon set, template, or UI kit pulled from
Community and shipped on ulus.me inherits its licence and possibly its attribution requirement. For
a non-profit publishing under an open-protocol banner, shipping unattributed CC BY assets would be a
straightforward and embarrassing violation. Cheap to check, expensive to get wrong.

## Low priority — named, then set aside

**9. Design review as a git-like process.** Branching is Org/Enterprise-only `[V]`, so this is
settled by entitlement, not by choice. See §5 above.

**10. Design system analytics / library analytics.** Measures component adoption across many
consumers. One site, one consumer — no signal to extract. Skip.

**11. SSO / SCIM / activity logs.** Organization-tier identity management for a one-person design
team. Not applicable now; revisit only if Ulus Tech grows enough that seat management becomes real.

**12. Version history retention per plan.** `[G]` — not established. Matters only as a downgrade
consideration, already partly covered in the entitlement file's lock-in section.

---

## Open for research

- [ ] **Webhook event types** — is there a `LIBRARY_PUBLISH` event? The docs defer to a separate
      Events page not fetched this pass. `[G]`
- [ ] **Webhook signature/passcode verification** — delivery-authenticity model. `[G]`
- [ ] **Plugin API version, sandbox model, org-private plugin gating.** `[G]`
- [ ] **AI credit allotments** — the Make FAQ states no figures and defers to a "How AI credits work"
      page. The 500/month figure for Collab/Dev/View is `[W]`; the Full-seat allotment is unknown.
- [ ] **Figma Make export artifact format** — export capability is confirmed `[V]`, but whether it is
      a zip, and what the project structure looks like, is not stated in the FAQ. `[G]`
- [ ] **Figma Sites custom-domain limits per plan** — not stated on the publish page; the Pro-10 /
      Org-unlimited figures are `[W]`.
- [ ] **Native contrast checking in Figma** — built in, or plugin-dependent? Feeds sweep item 3. `[G]`
- [ ] **Figma Sites custom-domain pricing after 2025** — the "free through 2025" claim is `[W]` and
      its window has closed.
- [ ] **Version history retention per plan.** `[G]`
- [ ] **Turkish font coverage and `locale="tr"` behaviour in Figma's renderer** vs browsers — sweep
      item 1, the highest-value item in this file and not yet researched at all. `[G]`
