# astro-tips.dev — source calibration and triage

**Date:** 2026-07-26 · **Fetched:** 2026-07-26 (site carries no per-page dates)
**Status:** survey. Decides nothing; routes to the topic files that do.

See [`README.md`](README.md) for provenance markers.

---

## 1. What the source is, and how far to trust it

`astro-tips.dev` is a community Starlight site by **astrolicious**
([repo](https://github.com/astrolicious/astro-tips.dev)), not an Astro-team property. Six tips,
three recipes, and an `/external-resources` page that is four links — Astro's own recipes,
Starlight, the site's repo, the astrolicious Discord. Nothing to mine there. **[V]**

**Calibration, and the reason to distrust every snippet on it:** the Biome page is written against
**Biome v1.6+**, and its example config pairs a `2.0.6` schema URL with a top-level
`organizeImports` key. That config **fails to deserialize** on Biome 2.5.5 —
`Found an unknown key organizeImports`. **[V]** — ran `biome lint --config-path` against that exact
block, 2026-07-26.

So: the site is a pre-2.5 snapshot. Its *observations* age better than its *configs*. Re-verify
anything before it is depended on. **[I]**

## 2. Triage

| Tip | Where it goes |
| --- | ------------- |
| [Setting up Biome](https://astro-tips.dev/tips/biome/) | [`formatting-astro-templates.md`](formatting-astro-templates.md) — its one surviving claim, and [`linting-biome-astro.md`](linting-biome-astro.md) for the lint overrides |
| [Setting up Prettier](https://astro-tips.dev/tips/prettier/) | [`formatting-astro-templates.md`](formatting-astro-templates.md) |
| [Dark mode](https://astro-tips.dev/recipes/dark-mode/) | [`dark-mode-theming.md`](dark-mode-theming.md) |
| [Leverage Zod's power](https://astro-tips.dev/tips/leverage-zod-s-power/) | [`zod-content-collections.md`](zod-content-collections.md) |
| [Dynamic imports in module scripts](https://astro-tips.dev/tips/script-tag-dynamic-imports/) | [`script-loading.md`](script-loading.md) |
| [How to add GSAP](https://astro-tips.dev/tips/how-to-add-gsap/) | Nowhere. GSAP rejected — [`animation-css-gsap-lenis.md`](animation-css-gsap-lenis.md) |
| [Setting up Shadcn UI](https://astro-tips.dev/tips/shadcn/) | Nowhere. No UI framework, no Tailwind |
| [Dynamic footer date for static sites](https://astro-tips.dev/recipes/dynamic-footer-date-for-static-websites/) | Nowhere. One-line problem: a static build freezes `new Date()` at build time; the fix is client-side or a rebuild |
| [Web components in MDX](https://astro-tips.dev/recipes/web-component-in-mdx/) | Nowhere yet. No MDX in the stack |

Two of nine pages are directly useful, two more are useful when the site grows content. The rest
are for stacks this project rejected.
