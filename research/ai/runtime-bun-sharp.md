# Runtime: Bun vs Deno, and the sharp hazard

**Date:** 2026-07-25, amended 2026-07-26 (sharp probed) · **Split from `astro-stack-2026.md`**
**Versions pinned:** Astro 7.1.3, sharp 0.35.3, Deno adapter tested against Deno 2.x
**Status:** settled — Bun for everything. See [`README.md`](README.md) for provenance markers.

---

## 1. The question mostly dissolves for a static site

Landing pages → `output: 'static'` → the runtime exists only at build time: install dependencies, run
`astro build`, emit `dist/`. Any HTTP server or CDN serves the output. No runtime lock-in either
way, and reversing the decision is a one-line CI change. **[I]**

## 2. Astro's own position on each

- **Bun** — Astro documents a Bun recipe but states it is experimental and "may reveal rough edges;
  some integrations may not work as expected". Bun issues are directed to Bun's tracker, not
  Astro's. **[V]** — [Use Bun with Astro](https://docs.astro.build/en/recipes/bun/)
- **Deno** — the SSR adapter moved from Astro to Deno; `@deno/astro-adapter` is maintained by Deno's
  core team, built and tested against Deno 2.x. **[V]** —
  [Deno adapter guide](https://docs.astro.build/en/guides/integrations-guide/deno/),
  [denoland/deno-astro-adapter](https://github.com/denoland/deno-astro-adapter)
- **[G]** Whether `@deno/astro-adapter` supports Astro **7** specifically is unverified; the sources
  reference Astro 6.

## 3. The concrete hazard: sharp

`astro:assets` uses **sharp** as its default image service. Bun + sharp has a documented
`MissingSharp` failure mode. **[V]** — [Images](https://docs.astro.build/en/guides/images/),
[MissingSharp](https://docs.astro.build/en/reference/errors/missing-sharp/),
[oven-sh/bun#6087](https://github.com/oven-sh/bun/issues/6087)

A landing site is image-heavy by definition, so this sits on the critical path rather than in a
corner. Documented mitigations: install `sharp` explicitly, or configure the passthrough image
service and pre-optimize assets outside the build. **[V]**

### Probed in this repo, 2026-07-26

Non-mutating check:

```
node_modules/sharp present
bun -e 'require("sharp")'  →  sharp 0.35.3 loaded ok
```

sharp resolves and loads natively under Bun on this machine, so the documented failure does not
reproduce here. **[V, local]** Strong but not conclusive: it proves module resolution, not that
`astro build` completes an image transform. The `<Image />` build test remains subtask 1 in
[`PLAN.md`](PLAN.md).

## 4. Recommendation

**Bun for install, scripts, and build. No Deno.**

1. The runtime is build-time-only for a static site — the decision is cheap and reversible. **[I]**
2. Bun is already the house runtime; a second runtime is a second thing to keep alive.
3. Bilgehan's objection to Deno's direction is a legitimate input, and nothing here outweighs it:
   Deno's only structural advantage (a first-party-maintained SSR adapter) is irrelevant while
   `output: 'static'`.
4. `dist/` is plain static files. Zero lock-in.
5. The one empirical risk — sharp — did not reproduce (§3).

### Repo inconsistency to fix

`bun.lock` exists while `package.json` declares `engines.node >= 22.12.0`. Astro 7's floor is Node
22 **[V]** — [Astro 7.0](https://astro.build/blog/astro-7/) — so the field is not wrong, but the
repo currently tells two stories about what runs the build. Drop it, or keep it explicitly as a
floor for contributors and state in CI which runtime produces the artifact. **[I]**

## Open for research

- [ ] `@deno/astro-adapter` compatibility with Astro 7. Moot unless the runtime decision reverses.
      **[G]**
- [ ] Whether `astro build` completes a real image transform under Bun — the remaining half of the
      sharp question. Empirical, not a search.
- [ ] Bun's Rust rewrite (stability, `unsafe` surface, v1.4 timing) is parked in
      [`out-of-scope-claims.md`](out-of-scope-claims.md) as `[W]`. It does not move this decision:
      the runtime exits when CI ends.
