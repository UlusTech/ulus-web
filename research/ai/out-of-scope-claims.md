# Parked `[W]` claims — unverified, do not depend on

**Date:** 2026-07-26 · **Split from `astro-stack-2026.md` §6.6, §6.7**
**Status:** ⚠️ **nothing here is verified, except the Figma block, which is adjudicated and moved
out.** See [`README.md`](README.md) for provenance markers.

> **Changed 2026-07-26 (sync pass, same day):** the Figma section had grown into a second copy of the
> four Figma files' conclusions, and ended with two consecutive paragraphs making the same argument
> about the pipeline shape. Collapsed to a headline plus pointers; the per-claim disposition table
> now has one home, in `figma-tokens-and-assets.md`. One claim (third-party DTCG plugins) stayed
> parked because no owning file verified it.

---

Everything in this file arrived via a pasted Claude-web session (`claude-web-talk.md`, since
removed) and is marked `[W]`: **asserted by another model and not independently checked.** Another
model's output is not a source.

It is recorded rather than discarded because several items are decision-relevant *later*, and losing
them would mean re-deriving the question. But none of it may be depended on until promoted to `[V]`
against a primary source. Some of it is for other repos entirely.

---

## For `ulus-haber-api`, not this repo

### Object storage

Claims **[W]**:

- MinIO relicensed from Apache 2.0 to AGPLv3 in 2021; removed the web console from the community
  edition in June 2025; entered maintenance mode in December 2025; the Community Edition GitHub
  repository was archived in February 2026 — no further development, no security patches, no
  prebuilt binaries, with AGPL-3.0 still in force. Existing deployments should plan migration during
  2026; new deployments should not start on MinIO Community.
- Alternatives proposed: **Garage** (AGPLv3, by Deuxfleurs, geo-distributed replication, designed for
  small-to-medium self-hosted scale) and **SeaweedFS** (Apache 2.0, Go, S3-compatible gateway,
  handles small and large files).

The underlying architectural point is not controversial and does not need verifying: **binaries in
object storage, metadata and keys in Postgres.** Blobs in Postgres bloat backups, stress the WAL,
and make replication miserable.

If this ever gets acted on, it needs its own research file in `ulus-haber-api`, not a promotion of
these lines. Every claim above is checkable against the MinIO repository, its release notes, and its
license history — none of that was done here.

## For the runtime decision, already settled without it

### Bun's Rust rewrite

Claims **[W]**: merged May 2026 as a single squashed commit of over a million lines; critics counted
13,044 `unsafe` blocks and 999+ uses of `static mut`; shipped canary-only via `bun upgrade --canary`;
v1.3.14 was the last Zig version and v1.4.0 will be the first Rust one; Claude Code has run on the
port in production since mid-June with a ~10% startup improvement.

**This does not move the decision** and was deliberately not researched. With `output: 'static'`, the
runtime executes for the length of a CI build and exits — a very different risk profile from a
process holding connection pools for weeks. The only thing that could have changed the answer was
sharp, and that was settled empirically in
[`runtime-bun-sharp.md`](runtime-bun-sharp.md).

### Deno's trajectory

Claims **[W]**: layoffs and leadership questions in March 2026; LTS discontinued after 2026-04-30
(EOL for v2.5) with no maintenance releases beyond that date; Deno 2.9 shipped 2026-06-25.

Context for a conclusion already reached on other grounds. Not re-verified.

### Cloudflare and Astro

Claim **[W]**: Cloudflare acquired the Astro team in January 2026, so Cloudflare-flavored deployment
paths can be expected to receive first-class treatment.

Relevant only if the site ever leaves static output. Not verified.

## For the design-token pipeline, genuinely open

### Figma Pro and design tokens — **adjudicated, moved out**

> **Resolved 2026-07-26.** This block is no longer a holding pen. Every claim in it was checked
> against primary sources, and the results now live in four dedicated files that **own** them:
> [`figma-plans-and-entitlement.md`](figma-plans-and-entitlement.md) (gating),
> [`figma-tokens-and-assets.md`](figma-tokens-and-assets.md) (format mechanics),
> [`figma-local-toolchain.md`](figma-local-toolchain.md) (MCP/editor),
> [`figma-surfaces-and-sweep.md`](figma-surfaces-and-sweep.md) (other surfaces).
>
> The per-claim disposition table lives at the end of `figma-tokens-and-assets.md`. It is not
> reproduced here — one copy, one owner.

Headline outcome, for someone reading this file alone:

- The **Variables REST API is Enterprise-only** `[V]`. No unattended CI token pull on Pro. This was
  the load-bearing claim and it survived.
- Native **DTCG export/import exists and is documented** `[V]`; its availability on Professional is
  `[I]`, not `[V]`, and needs a two-minute spot-check.
- "Aligned with the DTCG **1.0** spec" was **wrong** — there is no 1.0. First stable version is
  **`2025.10`, 2025-10-28** `[V]`.
- Everything else in the original bundle is `[G]` or `[W]` and is queued in
  [`README.md`](README.md).

**Only one claim from the original bundle is still parked here**, because no owning file verified it:

- **[W]** Third-party plugins (tokenHaus and others) export to DTCG, Tailwind, CSS variables, Style
  Dictionary and SCSS, preserving alias links. They exist in Community listings; their capabilities
  are unchecked.

The pipeline shape survives: `PLAN.md` subtask 7 already specifies a **manual** export committed to
git, and the commit step — token changes as reviewable diffs rather than silent library publishes —
is the part that carries the value. Naming as `category/role/variant` needs no translation layer, and
Figma's own import normalisation confirms it `[V]` (owning file, §2). What the evidence forecloses is
any later ambition to automate the pull on this plan.

`[I]` One piece of the original advice was never a Figma question and stands on its own: semantic
names must survive mode changes — `text/gray` breaks the moment a dark theme exists, `text/subdued`
does not. That is a naming discipline enforced by review, not by any tool.

---

## Do not copy snippets from pasted model output

Two concrete errors were caught in that session's JSON-LD block, both of which would have shipped as
fabricated claims about a real organization:

- `"nonprofitStatus": "Nonprofit501c3"` — a **US IRS** designation. Ulus is a Turkish *federasyon*.
- `"foundingDate": "2023"` — invented; that fact is not established anywhere.

The same rule applies to every config sketch in this directory, including ones written here: an
earlier draft of the Biome config in [`linting-biome-astro.md`](linting-biome-astro.md) named the
wrong domain key. Validate against the real schema before anything is written to the repo.

## Open for research

- [x] ~~**Figma Pro token export path**~~ — adjudicated 2026-07-26. The REST route is closed `[V]`;
      the UI DTCG route is `[I]` and needs a spot-check on the real account; the Plugin API route is
      open `[V]` but its headless story is `[G]`.
- [ ] **Third-party DTCG export plugins** (tokenHaus et al.) — the one Figma claim from the original
      bundle that no owning file verified. Listed in Community; capabilities unchecked. `[W]`
- [ ] **Object storage for `ulus-haber-api`** — belongs in that repo. Verify MinIO's actual status
      before treating Garage or SeaweedFS as necessary.
- [ ] TypeScript 7.0's breaking-change list, tracked in
      [`typescript-7-readiness.md`](typescript-7-readiness.md).
- [ ] The `initcwnd` tuning claim, tracked in
      [`seo-and-baseline-config.md`](seo-and-baseline-config.md).
