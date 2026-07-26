# Dark mode without a flash, under native `@view-transition`

**Date:** 2026-07-26 · **Source:** [astro-tips.dev dark-mode recipe](https://astro-tips.dev/recipes/dark-mode/),
fetched 2026-07-26
**Status:** unbuilt. Whether ulus.me ships a theme toggle at all is undecided — a design question,
not a research one.

See [`README.md`](README.md) for provenance markers.

---

## 1. The problem

A theme read from `localStorage` and applied by a bundled module script arrives *after* first paint.
The user sees a light flash, then the dark page. Bundled `<script>` in Astro is deferred by default,
which is exactly the wrong timing for this one job. **[I]**

## 2. The recipe's shape

Four parts, as fetched **[V]** (via a summarising fetch — the observations are reliable, the exact
code is not transcribed here):

1. **`<script is:inline>` in `<head>`** defining a `window.theme` API and applying the theme
   immediately, before the body paints. `is:inline` is load-bearing: it opts the script out of
   bundling and deferral. This is the entire anti-FOUC mechanism.
2. **`localStorage` with a graceful fallback** when it is unavailable (private mode, blocked
   storage), plus `matchMedia("(prefers-color-scheme: light)")` for the system default and a
   `change` listener so an OS-level switch propagates live.
3. **A separate, ordinary `<script>`** for toggle-button event listeners — kept out of the inline
   block so the API is not redeclared.
4. An `astro:after-swap` listener re-applying the theme after navigation.

Parts 1–3 are the standard answer to this problem and are router-independent. **[I]**

## 3. Part 4 does not apply here

`astro:after-swap` is a `<ClientRouter />` event — it exists because a same-document swap replaces
the DOM without a document load, so anything applied to `<html>` at boot is lost. **[I]**

This site uses **native cross-document `@view-transition`** ([`page-transitions-prefetch.md`](page-transitions-prefetch.md)).
Every navigation is a real document load, so the inline `<head>` script runs again on its own and
there is nothing to re-apply. **[I]**

Whether `astro:*` lifecycle events fire at all under cross-document view transitions is
**unverified**. **[G]** The conclusion does not depend on it: if they do not fire, part 4 is dead
code; if they do, it is a redundant re-application. Either way it is not needed.

## 4. What this costs, and the accessibility angle

An inline blocking script in `<head>` is a real render-blocking cost — deliberate, and the price of
correctness. Keep it tiny; it should touch one attribute on `<html>` and nothing else. **[I]**

Two constraints from the house rules, neither of which the recipe covers: **[I]**

- The theme attribute lands on `<html>`, the same element carrying `lang` — the i18n work writes
  there too. One of them must not clobber the other.
- A theme *transition* (colour cross-fade on toggle) needs `prefers-reduced-motion` respected, like
  every other animation on this site. The initial application must never animate.

## 5. Design question, ahead of any implementation

Three-state (`light` / `dark` / `auto`) or two? The recipe defaults to `auto`, which is the honest
default — it means "obey the OS unless told otherwise", and a stored `light`/`dark` is an explicit
override. Two-state UI cannot express "go back to following the system". **[I]**

## Open for research

- [ ] Do `astro:*` lifecycle events fire under cross-document `@view-transition`? Also open in
      [`page-transitions-prefetch.md`](page-transitions-prefetch.md). **[G]**
- [ ] Does a theme change mid-transition interact badly with an active cross-document view
      transition (stale snapshot painted in the old theme)? **[G]**
