# Animation: CSS first, GSAP, Lenis

**Date:** 2026-07-25 · **Split from `astro-stack-2026.md` §4.5, §5**
**Versions pinned:** GSAP 3.13 (all plugins free since 2025-04-30)
**Status:** settled — CSS only; neither library. See [`README.md`](README.md) for provenance markers.

---

## 1. CSS is enough for a landing site

The primitives now exist without JavaScript:

- scroll-driven animations — `animation-timeline: view()` / `scroll()`
- entry effects — `@starting-style`, `transition-behavior: allow-discrete`
- an `IntersectionObserver` plus a class toggle (~15 lines) where a scroll-driven fallback is needed

**Partly resolved 2026-07-26.** MDN carries an explicit status banner on `animation-timeline`:
*"Limited availability — This feature is not Baseline because it does not work in some of the most
widely-used browsers."* **[V]** —
[MDN animation-timeline](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline),
fetched 2026-07-26.

**[I]** That settles the *decision* — scroll-driven animation is progressive enhancement here, never
the load-bearing mechanism, and a static fallback is mandatory.

**[G]** The per-browser version numbers remain unverified. MDN renders its compatibility table with
JavaScript, so a fetch returns the banner but not the grid; caniuse has the same problem. Reading the
actual Safari and Firefox rows needs a real browser, and no version figure should be quoted here
until someone has looked. The banner is enough for the recommendation and not enough for a support
matrix.

Everything must be wrapped in a reduced-motion query. The safer pattern is to opt *in* to motion
(`@media (prefers-reduced-motion: no-preference)`) rather than opt out, because forgetting the query
then defaults to no animation rather than animation for everyone. **[I]**

This is not a nice-to-have. Motion sensitivity and vestibular disorders are real, every major OS
exposes the setting, and the browser hands it to CSS. Treat it like `lang` on `<html>` — part of
writing correct HTML.

## 2. GSAP

**Licensing:** 100% free including all former Club plugins (SplitText, MorphSVG, DrawSVG,
ScrollTrigger, ScrollSmoother) since **2025-04-30**, under Webflow; the plugins were moved into the
main GitHub repo and npm package. **[V]** — [Webflow blog](https://webflow.com/blog/gsap-becomes-free),
[GSAP 3.13](https://gsap.com/blog/3-13/)

**"Free" is not "open".** It remains a single-vendor library owned by a company that acquired it,
under a proprietary license granted generously. That is a lock-in surface even at zero price, because
everything authored lives in GSAP's timeline API rather than in CSS — removing it later means
rewriting the animations, not deleting a dependency. For an organization whose thesis is anti-lock-in,
that deserves a conscious decision rather than a default. **[I]**

MIT alternatives if the license matters more than the ergonomics: **Motion** (motion.dev, WAAPI-based)
and **anime.js v4**. Neither matches GSAP's timeline ergonomics and neither has an equivalent to
SplitText. **[W]**

**Verdict: do not add it for a landing site.** Roughly 70 KB (core + ScrollTrigger) of JavaScript on
a site whose selling point is that it has none. It earns its weight only for a real timeline with
sequencing and scrub control, SVG morphing, or per-character `SplitText` reveals. Fade-ins,
slide-ups, hover states and staggered card entrances are CSS. If it is ever added, import per-plugin
so it tree-shakes, and load it on the single page that needs it — never in the shared layout. **[I]**

## 3. Lenis

**The sources contradict each other and this file does not resolve it.**

- Lenis markets itself as using no CSS transforms and no hijacked scrollbars, running on native
  scroll so `position: sticky`, anchor links and accessibility keep working. **[V, vendor claim]** —
  [lenis.dev](https://www.lenis.dev/)
- Third-party writeups describe it as lerping a scroll position that other features then read
  incorrectly, and document a hard conflict with CSS `scroll-snap`. **[V, third-party]** —
  [raoulcoutard.com](https://raoulcoutard.com/posts/2026-02-03-lenis-scrollsnap-conflict-en/)

The distinction being argued over is real: the classic broken approach fakes a `position: fixed`
container and translates it with JS so native scroll never fires, breaking the scrollbar, arrow keys
and assistive tech. Lenis does not do that. What it does do is ease the native scroll position — and
that is enough for anything reading the *real* position to disagree with what is on screen.

The operational point stands under either reading: **Lenis takes ownership of a behavior the browser
already owns.** What becomes our problem: `prefers-reduced-motion` (must disable it entirely),
anchor jumps, scroll restoration on back-navigation, `scroll-snap`, and — directly relevant —
**CSS scroll-driven animations**, which read the real scroll position. Choosing Lenis means not
choosing §1's recommended mechanism. **[V/I]**

**Verdict: no.** Smooth scrolling is a taste preference imposed on every visitor, including those
whose OS setting explicitly asks for less motion. `scroll-behavior: smooth` covers anchor navigation,
which is the only case where the browser default is genuinely worse.

If a specific design later requires it, gate it on
`matchMedia('(prefers-reduced-motion: reduce)')` and do not initialize when it matches. It is the
easiest thing on this list to add later and the easiest to regret.

## Open for research

- [x] ~~Scroll-driven animation support — does it decide whether §1 is load-bearing or
      enhancement-only?~~ **Resolved 2026-07-26: enhancement-only.** `animation-timeline` is
      explicitly **not Baseline** per MDN **[V]**.
- [ ] The per-browser version matrix for `animation-timeline` in Safari and Firefox. MDN and caniuse
      both render their tables with JS, so this needs a real browser, not a fetch. **[G]**
- [ ] `@starting-style` and `transition-behavior: allow-discrete` support, same question and the same
      fetch limitation. **[G]**
- [ ] Resolve the Lenis contradiction if it ever becomes decision-relevant — read the source rather
      than either marketing or blog posts. Currently moot, since the recommendation is no.
