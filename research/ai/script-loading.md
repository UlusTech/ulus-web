# Script loading — dynamic imports in `<script>`

**Date:** 2026-07-26 · **Source:** [astro-tips.dev dynamic-imports tip](https://astro-tips.dev/tips/script-tag-dynamic-imports/),
fetched 2026-07-26
**Status:** correct technique, no current subject on this repo.

See [`README.md`](README.md) for provenance markers.

---

## 1. The technique

Inside an Astro `<script>` (bundled, module scope), `await import()` a module only once it is
actually needed, rather than shipping it in the initial bundle. Gating conditions the tip names:
IntersectionObserver visibility, a `matchMedia` device check, a feature flag. **[V]** — page as
fetched.

## 2. The caveat is the valuable half

Do **not** put a dynamic import behind a click handler. The download lands exactly where the user
expects instant feedback — *"when a user clicks a button they expect it to react instantly."*
**[V]**

The correct pattern where interaction is involved is to start the import on an earlier, weaker
signal — hover, focus, viewport entry — and let the click await an already-settled promise. **[I]**

## 3. Applicability here — near zero today

A static landing site with native `@view-transition`, no UI framework, no GSAP and no Lenis has
almost no JavaScript to split. Splitting a few kilobytes across an extra request is a net loss.
**[I]**

The realistic future subjects, all speculative: a map, a video player, a heavy chart, or a
client-side search index. Any of those arrives as a candidate for a viewport-gated dynamic import.
Until one exists, this is a technique on file, not a task. **[I]**

## 4. One interaction worth remembering

Under cross-document `@view-transition` every navigation is a fresh document, so a dynamically
imported chunk is re-evaluated per page rather than persisting like it would under a client-side
router. That weakens the payoff of splitting shared code and strengthens the case for HTTP caching
of the chunk instead. **[I]** — see [`page-transitions-prefetch.md`](page-transitions-prefetch.md)
for the cache-header side.
