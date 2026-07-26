# Page transitions and prefetch

**Date:** 2026-07-25, amended 2026-07-26 · **Split from `astro-stack-2026.md` §4.3, §4.4, §6.4**
**Versions pinned:** Astro 7.1.3; Chrome/Edge 126+, Safari 18.2+, Firefox 144
**Status:** settled — native `@view-transition`. See [`README.md`](README.md) for provenance markers.

---

## 1. The transitions decision

Two mutually exclusive options. `<ClientRouter />` is documented as **not compatible with native
browser MPA routing**. **[V]** —
[astro:transitions reference](https://docs.astro.build/en/reference/modules/astro-transitions/)

### Option A — native cross-document, zero JS

The CSS at-rule `@view-transition { navigation: auto; }` opts both documents into a transition
across a real navigation.

- Requires same-origin navigation; `navigation: auto` covers `traverse` / `push` / `replace`
  initiated from page content, not browser UI. **[V]** —
  [MDN @view-transition](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@view-transition)
- **Not Baseline.** Chrome/Edge 126+, Safari 18.2+. **Firefox shipped *same-document* transitions in
  144; cross-document is still missing** as of mid-2026, possibly Interop 2026. **[V]** — MDN,
  [caniuse](https://caniuse.com/cross-document-view-transitions)
- Degrades to an instant navigation. Zero JS, zero dependency. Removing it is deleting four lines.

### Option B — `<ClientRouter />`

Intercepts navigation and performs a same-document swap, so it uses the *same-document* View
Transition API — which **Firefox 144+ does support**. That is the one real functional argument for
it. **[V]** It also brings prefetch enabled automatically, the `transition:name` /
`transition:animate` / `transition:persist` directives, and lifecycle events.

Its cost: it ships a client router, swaps the document instead of navigating it, and makes script
lifecycle a permanent problem — every third-party script and every `<script>` must be
re-initializable on `astro:page-load`. **[I]**

### Recommendation: A

Firefox users get instant navigation, which is not a defect. The site stays zero-JS, which is the
thing that actually makes it fast and the thing that lets it outlast the people who built it.

- **Failure mode of A:** none functional; aesthetic degradation in Firefox only.
- **Failure mode of B:** a script that forgets `astro:page-load` breaks after the first navigation,
  and the bug **does not reproduce on a hard reload** — the developer refreshes, it works, the ticket
  closes. That class of bug is expensive and never stops being possible.

There is also a consistency argument: shipping a JavaScript router to animate away a page load, on a
site whose whole premise is a first response small enough to arrive in one round trip, is
self-defeating. **[I]**

Revisit only if a design requires a shared element morphing across pages — a logo flying from header
into hero. Note that `view-transition-name` does work across documents, so even that may not need B.

Wrap the at-rule in `@media (prefers-reduced-motion: no-preference)`. Astro does this internally
inside `<ClientRouter />`; using the native at-rule makes it our responsibility. **[W/I]**

## 2. Prefetch

Prefetch does **not** require `<ClientRouter />` — it just has to be configured explicitly, since we
are not getting it free.

- Default strategy for `data-astro-prefetch` links is `hover`. **[V]**
- Configurable via `prefetch.defaultStrategy`; `'viewport'` prefetches on entry into viewport.
  `prefetchAll: true` covers all internal links without per-link attributes. **[V]**
- When `<ClientRouter />` is present, prefetch is automatically enabled with `prefetchAll: true`.
  **[V]** — [Prefetch](https://docs.astro.build/en/guides/prefetch/)

Strategies, roughly by cost: `hover` (on mouse enter — buys most of the perceived gap, cheapest),
`tap` (on mousedown/touchstart — smallest win, safest for metered connections), `viewport`
(fastest-feeling, most wasteful), `load` (everything immediately — only sane below ~10 pages).

**For this site: `prefetchAll: true` + `hover`.** Bounded page count, so prefetching everything is
not wasteful, and `hover` avoids burning mobile data on links people scroll past. Override per-link
where intent is known. **[I]**

### Cache headers are load-bearing

Verified from the Astro prefetch docs **[V]** — [Prefetch](https://docs.astro.build/en/guides/prefetch/):

- **Safari** does not support `<link rel="prefetch">` and falls back to `fetch()`, which needs
  `Cache-Control`, `Expires`, `ETag`. `ETag` is non-functional in private browsing windows.
- **Firefox** *does* support `<link rel="prefetch">` but requires explicit `Cache-Control` or
  `Expires`, or it throws **`NS_BINDING_ABORTED`**. With a valid `ETag` the response is still
  reusable on navigation even if the prefetch errored.
- Static/prerendered pages often get `ETag` automatically from a deploy platform — but **we
  self-host behind Caddy, so this is ours to set.** Without it, prefetch is a silent no-op for a
  large share of traffic.

**Correction:** the Claude-web session attributed `NS_BINDING_ABORTED` to Safari. Per the docs it is
the **Firefox** failure mode; Safari's issue is the `fetch()` fallback needing cache headers. Both
need headers, for different reasons.

Header shape: hashed assets under `/_astro/*` immutable and long-lived; HTML `max-age=0,
must-revalidate` so it revalidates via `ETag` on every navigation. **[I]**

### clientPrerender — defer

`experimental.clientPrerender` injects a `<script type="speculationrules">` and exposes an
`eagerness` option (`immediate` / `eager` / `moderate` / `conservative`) following the Speculation
Rules API, balancing wait time against visitors' bandwidth, memory and CPU. **[V]** It is
experimental and Chromium-only.

**[W]** Claimed: `security.csp: true` together with `clientPrerender: true` produces a CSP violation
on the injected inline speculation rules, requiring a hash or nonce. Plausible given what the flag
injects, but **not verified**. Test before enabling both.

Get `prefetchAll` + `hover` + correct cache headers working first; this is a later optimization.

## Open for research

- [ ] `security.csp` + `clientPrerender` interaction. **[W]**
- [ ] Whether Firefox has shipped cross-document view transitions in any release after 144 — that
      would remove the last argument for `<ClientRouter />` entirely. Not yet as of mid-2026.
      Rechecked 2026-07-26: MDN still banners `@view-transition` as *"Limited availability — not
      Baseline because it does not work in some of the most widely-used browsers"* **[V]**, which is
      consistent with Firefox still missing but does **not** name the browser. The per-browser grid is
      JS-rendered and unfetchable; confirming Firefox specifically needs a real browser. **[G]**
- [ ] Confirm Astro wraps its own view-transition CSS in a reduced-motion query, and what the
      documented equivalent is when moving to the native at-rule. **[W/I]**
