# Parked `[W]` claims — unverified, do not depend on

**Date:** 2026-07-26 · **Split from `astro-stack-2026.md` §6.6, §6.7**
**Status:** ⚠️ **nothing here is verified.** See [`README.md`](README.md) for provenance markers.

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

### Figma Pro and design tokens

Claims **[W]**:

- The **Variables REST API is Enterprise-only** — scopes `file_variables:read` / `file_variables:write`
  return 403 "Limited by Figma plan" otherwise, and the calling user needs a full Enterprise seat.
  So no CI job that pulls tokens automatically on a Pro plan.
- **Native DTCG export/import** (aligned with the W3C Design Tokens Community Group 1.0 spec) rolled
  out around December 2025 and is available in the UI, not gated behind Enterprise. Export per mode
  yields a zip; import works by dragging JSON in.
- Import is nuanced with two-way aliases — the referenced collection must already be imported or
  variables arrive broken. Treat the flow as one-directional, Figma → code.
- Third-party plugins (tokenHaus and others) export to DTCG, Tailwind, CSS variables, Style
  Dictionary and SCSS, preserving alias links.

**This one matters and should be verified before the token pipeline is designed**, since Bilgehan is
on Figma Pro and the whole approach depends on which path is actually available.

The proposed shape — export DTCG JSON from Figma, commit it, run Style Dictionary, emit
`tokens.css` — is worth keeping regardless of which export mechanism is available. The commit step is
the valuable part: token changes become reviewable git diffs instead of silent library publishes,
which is the same principle as everything else in this project. Naming as `category/role/variant`
(`color/text/primary` → `--color-text-primary`) removes the translation layer, and semantic names
must survive mode changes — `text/gray` breaks the moment a dark theme exists, `text/subdued` does
not. **[W/I]**

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

- [ ] **Figma Pro token export path** — the highest-priority item in this file, because a decision
      depends on it.
- [ ] **Object storage for `ulus-haber-api`** — belongs in that repo. Verify MinIO's actual status
      before treating Garage or SeaweedFS as necessary.
- [ ] TypeScript 7.0's breaking-change list, tracked in
      [`typescript-7-readiness.md`](typescript-7-readiness.md).
- [ ] The `initcwnd` tuning claim, tracked in
      [`seo-and-baseline-config.md`](seo-and-baseline-config.md).
