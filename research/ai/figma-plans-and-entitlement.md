---
topic: Figma plan tiers, seat types, and per-capability entitlement (2026-07-26)
date: 2026-07-26
versions: >
  Figma pricing/plan structure and REST API as published on figma.com/pricing,
  figma.com/pricing-faq, developers.figma.com, and help.figma.com on 2026-07-26.
  Pricing pages are volatile — re-check before relying on a dollar figure more
  than a few months old.
status: research — not yet promoted to .context/
---

# Figma plan tiers, seat types, and entitlement (2026-07-26)

**Spine document.** Three sibling files depend on the entitlement table below being right, so
every cell is sourced individually rather than trusted from a single pricing-page fetch — the
pricing page's own feature-comparison table turned out to be wrong on two features when checked
against Figma's dedicated help articles (see the Code Connect and Branching rows). Trust the
narrow, feature-specific docs page over the broad marketing comparison table when they disagree.

**This file owns entitlement and gating** for the Figma set — see the fact-ownership table in
[`README.md`](README.md). Sibling files state gating conclusions with a marker and a pointer here;
they do not re-argue them.

> **Changed 2026-07-26 (sync pass, same day):** the Answer headline carried a single `[V]` across two
> claims graded differently — split into `[I]` / `[V]`. The Full-seat assumption was a parenthetical
> "presumably" propping up three files' conclusions; promoted to a named gap. The org-private-plugin
> row carried three contradictory markers (`[V]`, `[W]→ leaning V`, `[G]`) — resolved to `[G]`.
> **Two gradings changed**, both where a claim carried conflicting markers and one had to win. No
> claim's *evidence* changed and nothing was re-sourced.

## Answer

**Bilgehan is on Figma Pro (= "Professional"). Can Ulus run a Figma → code token pipeline without
paying for Organization or Enterprise?**

**Yes for the DTCG-export path `[I]`, no for the Variables REST API path `[V]`.**

The two conjuncts are **not equally graded**, and the difference is the whole point of this
document. The REST-API closure is verified against explicit "Enterprise plan only" language on two
primary pages. The DTCG-export availability is an *inference* from the modes-eligibility line — see
the second bullet below. Do not quote this headline without both markers.

> **Seat assumption, load-bearing and unconfirmed.** Everything below assumes a **Full seat**. It was
> never verified. Three files' conclusions turn on it: the desktop MCP server's Dev/Full gate
> (`figma-local-toolchain.md` §1.3), the 15/min Tier-1 asset-export figure
> (`figma-tokens-and-assets.md` §5 — a View/Collab seat makes it 6 **per month**, which kills the
> asset pull outright), and the rate-limit reasoning in §4 here. Thirty seconds in account settings
> settles it. `[G]`, queued at global rank 2.

- The **[W] claim in `out-of-scope-claims.md` that the Variables REST API is Enterprise-only is
  CONFIRMED**, not broken. `developers.figma.com/docs/rest-api/variables/` states outright: "To use
  this API, you must have a Full seat in an Enterprise org; guests cannot use the API." Both
  `file_variables:read` and `file_variables:write` are marked "Note: Enterprise plan only" on the
  scopes reference page. No CI job on Pro can call this API — a token minted from a Pro account will
  get a 403, consistent with the parked claim's description (the docs don't reproduce the exact
  error string, so that phrasing itself stays `[W]`; the *gating* is `[V]`).
- The **[W] claim that native DTCG variable export/import shipped ungated in the UI is LIKELY
  correct, but is graded `[I]` here, not `[V]`** — the primary source does not say it directly.
  `help.figma.com`'s "Modes for variables" article documents the drag-and-drop DTCG JSON import and
  per-mode export UI in the same article whose "Who can use this feature" box reads "Anyone on
  Education, Professional, Organization, and Enterprise plans can create and use modes for
  variables" — but that box is scoped to *modes*, not to the import/export action specifically, and
  no separate plan note appears next to the import/export instructions. The inference (modes
  eligibility + absence of any narrower gate stated on the same page = import/export is available on
  the same plans) is reasonable but not a verified fact; a dedicated "Import/export variables" help
  article, if one exists separately from "Modes for variables," was not located. **`[I]`, not `[V]`.**
  If Ulus is going to build a pipeline around this, confirm it empirically on Bilgehan's own Pro
  account before relying on it further.
  A second, independently-gated path exists: the **Plugin API's variables methods
  (`getLocalVariablesAsync`, `createVariable`, etc., in
  `developers.figma.com/docs/plugins/api/figma-variables/`) state no plan restriction at all** —
  distinct from the REST API, which is explicitly Enterprise-gated. A plugin run inside the Figma
  desktop/web client on Bilgehan's Pro seat could read and export variables programmatically without
  the REST API's gate. This is not proven to be a viable *unattended CI* path — plugins normally run
  inside a live Figma client, not headlessly — but it is a real, ungated, code-level surface, and is
  the strongest fallback if the DTCG-UI `[I]` claim above doesn't hold up under an actual test. Both
  paths are manual-or-client-bound, not API-automatable, on Pro — there is no unattended CI path to
  pull variables automatically on Pro, because that path is the Variables REST API, which is
  Enterprise-gated.
- **Two features the marketing pricing table implied were on Professional are not**: Code Connect
  and Branching & merging are both Organization/Enterprise-only per their dedicated help articles.
  If a sibling doc assumes Code Connect is available on Pro, that assumption is wrong — flag it.

## Evidence

### 1. Plan tiers (2026-07-26)

Four tiers: **Starter** (free), **Professional**, **Organization**, **Enterprise**. `[V]`
figma.com/pricing — fetched 2026-07-26. Professional bills monthly or annually; Organization and
Enterprise are annual-only. `[V]` same source.

**All specific dollar figures below are `[W]`, not `[V]`, and should be treated as ballpark only.**
They come from two sources: a WebFetch summarization of figma.com/pricing, and a WebSearch
aggregation of third-party pricing trackers (saasgenius.com, vendr.com, costbench.com,
comparedge.com). The WebFetch summary of that same pricing page is independently known to be wrong
on two feature-gating rows (Code Connect, Branching — see the entitlement table below), so its
reliability for numbers is not assumed to be any better than the third-party aggregation it's being
cross-checked against. Figures seen, for the record, not for citation: Starter free; Professional
somewhere around $12–16/editor/month depending on monthly vs. annual billing; Organization Full seat
around $55/mo; Enterprise Full seat around $90/mo, with Dev/Collab seats priced lower on each tier.
**Do not quote a specific number from this document — re-fetch figma.com/pricing directly and read
the rendered page before using a dollar figure anywhere.** `[W]`, uniformly. The tier *ordering and
gating* (four tiers, Organization/Enterprise annual-only) is `[V]` per the same figma.com/pricing
fetch, since that portion of the fetch is structural (tier names, billing cadence) rather than a
feature-comparison judgment call, and was not contradicted by any narrower source.

### 2. Seat types

Figma sells **View, Collab, Dev, and Full** seats; the specific set of paid seat types is **Collab,
Dev, Full** (View/viewer access is unlimited and unseated on every plan). `[V]`
developers.figma.com/docs/rest-api/rate-limits — the rate-limit table itself keys off "Seat type
(View, Collab, Dev, or Full)", confirming all four exist as access-control categories even though
View is free. `[V]`

- **Full seat** — editing rights, required for anything that writes (POST to the Variables API,
  merging branches, admin actions). `[V]` (drawn from the Variables API and branching access-matrix
  quotes below, both primary).
- **Dev seat** — Dev Mode inspection plus most developer-platform reads; explicitly sufficient (with
  Full) for Dev Mode, Code Connect, and the Dev Mode MCP server. `[V]` per-feature citations below.
- **Collab / View seats** — commenting/viewing; REST API and MCP access exist but are throttled to
  "up to 6/month," effectively unusable for a pipeline. `[V]`
  developers.figma.com/docs/rest-api/rate-limits and .../figma-mcp-server/rate-limits-access/.

### 3. Per-capability entitlement table

| Capability | Plan required | Seat required | Source (primary) |
|---|---|---|---|
| Dev Mode | "Available on all paid plans" — i.e. Professional and up, not Starter | Full or Dev | `[V]` help.figma.com, "Guide to Dev Mode" |
| REST API, general read | Nominally gated to paid plans per the pricing comparison table, but in practice works on Starter too, throttled to "up to 6/month" per file regardless of the caller's own plan if the *file* lives on a Starter team | Any (rate varies sharply — Collab/View get 6/mo even on paid plans; Dev/Full get 10-15 req/min on Starter/Professional resources) | `[V]` developers.figma.com/docs/rest-api/rate-limits |
| **Variables REST API** (`file_variables:read`/`write`) | **Enterprise only** | **Full seat**, admin for writes; "guests cannot use the API" | `[V]` developers.figma.com/docs/rest-api/variables/ and .../rest-api/scopes/ — both state "Enterprise plan only" |
| Native DTCG variables export/import (UI) | Education, Professional, Organization, Enterprise — **not Enterprise-exclusive**, but this is inferred from the *modes* eligibility line on the same page, not a statement about import/export specifically | Not separately gated by seat in the docs found (variables generally require edit access to change, view access to export) | `[I]` help.figma.com "Modes for variables" article — see Answer section caveat |
| Webhooks v2 | Professional and up (150 webhooks/plan on Professional, 300 Organization, 600 Enterprise); context caps (20/team, 5/project, 3/file) apply on all plans | Team admins or users with edit permission | `[V]` developers.figma.com/docs/rest-api/webhooks |
| **Code Connect** | **Organization and Enterprise only** — NOT Professional, despite the pricing-page comparison table implying otherwise | Dev or Full seat | `[V]` help.figma.com "Guide to Code Connect" AND developers.figma.com/docs/code-connect/ — two independent primary sources agree, both explicitly excluding Professional |
| Dev Mode MCP server | All paid plans usable; Professional gets meaningfully lower throughput (200/day, 10/min) than Organization (600/day, 20/min); Starter capped at 6/month | Dev or Full seat for practical throughput; Collab/View technically permitted at 6/month | `[V]` developers.figma.com/docs/figma-mcp-server/rate-limits-access/ |
| Plugin/widget publishing, org-private plugins | Public plugin publishing: any plan. Org-private plugins: **probably** Organization and Enterprise only | Full seat implied for private-plugin administration | `[G]` — from help.figma.com search results, never re-fetched from a dedicated help article the way Branching and Code Connect were. Pattern-consistent with both, but pattern-consistency is not a source. Re-check before depending on it |
| Branching & merging | **Organization and Enterprise only** — NOT Professional | Full seat to create a branch; anyone with edit access to the main file can merge | `[V]` help.figma.com "Guide to branching" — direct quote: "Available on the Organization and Enterprise plans" / "Requires a Full seat" |
| Library + design system analytics | Organization and Enterprise only (library_analytics:read scope explicitly marked "Enterprise plan only" in the API scopes doc; in-app library analytics groups with the same Organization-tier features per the branching/downgrade help article) | Admin-level for org analytics | `[V]` developers.figma.com/docs/rest-api/scopes/ (API side, Enterprise-only); `[I]` in-app parity inferred from the downgrade-loss list in the same help article that covers branching, not independently re-fetched for the in-app case |

### 4. Personal access tokens vs OAuth2

- **PAT expiry**: maximum 90 days; **non-expiring PATs can no longer be created**, as of a
  2025-04-28 changelog entry. `[V]` developers.figma.com/docs/rest-api/changelog/
- **PAT creation flow**: Settings → Security → "Generate new token," set expiration and scopes at
  creation time, token is shown once. `[V]` developers.figma.com/docs/rest-api/personal-access-tokens/
- **Scopes**: 23 scopes total, split into general file/user scopes (unrestricted by plan — e.g.
  `file_content:read`, `file_comments:read/write`, `file_metadata:read`, `webhooks:read/write`) and
  a set explicitly marked "Enterprise plan only": `file_variables:read/write`,
  `library_analytics:read`, `org:activity_log_read`, `org:ai_metering_usage_read`, plus
  `org:developer_log_read` and `org:discovery_read` which require "Enterprise plan **with
  Governance+**." `[V]` developers.figma.com/docs/rest-api/scopes/
- **Rate limits**: three-factor model — seat type (View/Collab = "low" tier, Dev/Full = "high"
  tier), the endpoint's own tier (1/2/3), and the **plan of the resource being accessed**, not just
  the caller's own plan. A Full-seat caller on Enterprise hitting a file that lives in someone else's
  Starter team is still capped at ~6 requests/month against that file. New limits took effect
  2025-11-17. `[V]` developers.figma.com/docs/rest-api/rate-limits and
  .../docs/updates-to-figmas-developer-platform/
- **OAuth2 apps**: subject to the same tiered rate limits; a September 2025 changelog entry required
  all OAuth apps to complete a new publishing flow by 2025-11-17 or be moved to draft state and lose
  API access. `[V]` developers.figma.com/docs/rest-api/changelog/
- **Plan access tokens — the operationally decisive fact for a Pro-plan CI pipeline.**
  `developers.figma.com/docs/rest-api/plan-access-tokens/` describes a third credential type,
  distinct from both PATs and OAuth apps: "not tied to an individual user account," scoped to an
  org/enterprise plan instead, supporting up to a **1-year expiry** (vs. 90 days for PATs), an
  allowlist of specific resources, and explicitly built for unattended automation ("organization-
  level automation" without "user authentication flows") where PATs are framed as "designed for
  interactive workflows, not automation." **These are "available for Organization and Enterprise
  plans"** — stated directly, `[V]`. Consequence for Ulus: **on Pro, there is no service-account
  token.** Every automated call a Pro-plan pipeline makes is bound to one human's personal PAT, dies
  in 90 days, and needs manual rotation — there is no organization-level credential to hand to a CI
  runner until Ulus is on Organization or above.
- Curl shape for a PAT-authenticated read, illustrative only, not a recommendation on where to run
  it:
  ```
  # sketch — auth model only, not a pipeline design
  curl -H "X-Figma-Token: $FIGMA_PAT" \
    https://api.figma.com/v1/files/:file_key
  ```

### 5. Non-profit / education pricing — does Ulus qualify?

**No.** Figma's own pricing FAQ is unambiguous: `[V]` figma.com/pricing-faq —

> "We do not have any discounts for non-profits. Anyone is welcome to use Figma's free plan."

The Education plan (free, full Professional-tier functionality) explicitly **excludes** "'Not-for-
profit' or 'non-profit' organizations" from eligibility by name, alongside early-stage startups and
self-directed learners — it is scoped to enrolled students/educators at accredited institutions,
bootcamps, and online courses, for 2 years (K-12/higher-ed) or 6 months (bootcamps). `[V]` same
source.

**Conclusion for Ulus**: a Turkish non-profit federasyon does not qualify for any Figma discount
program on the evidence found. Bilgehan's existing Pro seat, or a straight Organization/Enterprise
purchase, are the only paths — there is no discounted third tier to check for. Regional (Turkey)
pricing was not found on any fetched page; Figma's pricing pages did not surface a
localized/discounted Turkey rate in this research pass. `[G]`

### 6. Pro → Starter downgrade — the lock-in exit cost

`[V]` help.figma.com, "Upgrade or downgrade your plan," and figma.com/pricing-faq:

- Team is restricted to **3 total Figma Design/Sites files per project**, 3 files each for FigJam
  and Slides.
- Team is restricted to **one project**; a multi-project team gets **locked entirely** ("Figma will
  lock your team and prevent you from editing your files") until reorganized.
- Files over the limit are **not deleted** — they become locked/uneditable. Move them to another
  team or to personal drafts to keep editing.
- **Unlimited version history is lost** at the end of the paid period — pricing-faq explicit:
  "your team will lose access to paid features like the team component library and unlimited version
  history."
- **Team component library access is lost** (same quote).
- Published Figma Sites are automatically unpublished on downgrade; Figma Make apps stay published
  at their default subdomain but lose any connected custom domain.
- Not addressed in the fetched pages, and left as a gap: whether REST API tokens issued while on Pro
  continue to function post-downgrade at Starter's throttled ~6/month rate, or are revoked outright.
  `[G]`

## Open questions & unverified

- **Exact Organization/Enterprise dollar figures** — sourced from a WebSearch aggregation snippet,
  not a direct re-read of the rendered figma.com/pricing page. The tier *gating* is solid; the
  *numbers* are `[W]` and should be re-fetched directly before being quoted anywhere financial.
  `[G]`
- **Org-private plugin publishing** — the Organization/Enterprise gating is plausible and pattern-
  consistent with Branching and Code Connect, but was not confirmed against a dedicated help article
  the way those two were. Re-check before treating it as settled. `[G]`
- **In-app (non-API) library analytics** gating was inferred from the downgrade-loss list on the
  branching help article, not independently fetched from its own feature page. `[G]`
- **Exact 403 error string** for a Pro-plan Variables API call ("Limited by Figma plan") — the
  *gating* is confirmed by explicit "Enterprise plan only" language on two primary pages, but no
  fetched page reproduced the literal error string, so that specific phrasing from the original `[W]`
  claim stays unverified. `[G]`
- **Whether the Plugin API's variables methods are practically usable for an unattended pipeline.**
  Confirmed `[V]` that `developers.figma.com/docs/plugins/api/figma-variables/` states no plan
  restriction on `getLocalVariablesAsync`, `createVariable`, etc. — a real, ungated surface distinct
  from the Enterprise-gated REST API (see Answer section). What's still open: plugins run inside a
  live Figma client (desktop/web), and no primary source was checked in this pass for whether Figma
  supports a headless/CI plugin runner. If one doesn't exist, this path still requires a human (or a
  scripted browser) driving the Figma UI, which changes the pipeline design but doesn't eliminate the
  option. Check `developers.figma.com/docs/plugins/` for any headless-execution story before
  designing around this. `[G]`
- **Whether the DTCG-UI export/import path (graded `[I]` above, not `[V]`) actually behaves as
  documented on Bilgehan's specific Pro account** — the empirical test (open Figma, try exporting a
  variable collection as DTCG JSON) is cheap and should happen before the pipeline is designed around
  it. `[G]`
- **Turkey-specific/regional pricing** — not found in this pass. `[G]`
- **Whether REST tokens survive a Pro→Starter downgrade** — not addressed in fetched sources. `[G]`

## Sources

Primary (figma.com / developers.figma.com / help.figma.com), all fetched 2026-07-26:

- https://www.figma.com/pricing/ — tier and seat pricing table (feature-comparison portion found
  partially unreliable, see note above)
- https://www.figma.com/pricing-faq/ — non-profit/education eligibility, downgrade consequences
- https://developers.figma.com/docs/rest-api/ — REST API introduction
- https://developers.figma.com/docs/rest-api/variables/ — Variables API plan/seat gating
- https://developers.figma.com/docs/rest-api/scopes/ — full scope list, Enterprise-only markers
- https://developers.figma.com/docs/rest-api/rate-limits — three-factor rate-limit model
- https://developers.figma.com/docs/rest-api/personal-access-tokens/ — PAT creation flow
- https://developers.figma.com/docs/rest-api/plan-access-tokens/ — plan access tokens, Org/Enterprise
  only, the service-account gap on Pro
- https://developers.figma.com/docs/plugins/api/figma-variables/ — Plugin API variables methods, no
  stated plan restriction
- https://developers.figma.com/docs/rest-api/changelog/ — PAT 90-day expiry (2025-04-28), API
  platform update dates
- https://developers.figma.com/docs/rest-api/webhooks — webhook plan limits
- https://developers.figma.com/docs/code-connect/ — Code Connect plan/seat gating
- https://developers.figma.com/docs/figma-mcp-server/rate-limits-access/ — MCP server plan/seat/
  rate-limit table
- https://developers.figma.com/docs/updates-to-figmas-developer-platform/ — Nov 2025 rate-limit
  rollout
- https://help.figma.com/hc/en-us/articles/15023124644247-Guide-to-Dev-Mode — Dev Mode gating
- https://help.figma.com/hc/en-us/articles/23920389749655-Guide-to-Code-Connect — Code Connect
  gating (corroborates developers.figma.com)
- https://help.figma.com/hc/en-us/articles/360063144053-Guide-to-branching — Branching gating
- https://help.figma.com/hc/en-us/articles/360046216313-Upgrade-or-downgrade-your-plan — downgrade
  mechanics
- https://help.figma.com/hc/en-us/articles/15343816063383-Modes-for-variables — DTCG import/export
  UI instructions and the "Who can use this feature" box (scoped to modes, not import/export
  specifically — see `[I]` caveat in Answer)

Secondary (not load-bearing, used only to locate primary pages or as noted `[W]` above):

- WebSearch aggregation snippets citing saasgenius.com, vendr.com, costbench.com, comparedge.com for
  Organization/Enterprise dollar figures — not independently re-verified.
