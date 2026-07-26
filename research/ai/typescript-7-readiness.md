# TypeScript 7 / tsgo readiness

**Date:** 2026-07-26 · **Split from `astro-stack-2026.md` §6.3**
**Versions pinned:** TypeScript 7.0 GA 2026-07-08; 7.1 expected ~2026-10; Astro 7.1.3
**Status:** settled — stay on TypeScript 6.x. See [`README.md`](README.md) for provenance markers.

---

## What shipped

TypeScript 7.0 reached GA on **2026-07-08**. It is a Go port of the compiler and language service
(Project Corsa), roughly 10x faster on full typecheck — VS Code's ~2.3M-line codebase reported at
10.6s against 125s. **[V]** —
[TypeScript 7 release coverage](https://typescriptpro.com/blog/typescript-version-7-2026-07-08)

## Why we cannot use it yet

**7.0 ships without a stable programmatic compiler API. That API lands in 7.1, expected around
October 2026.** Tools that embed the compiler — Volar (Vue, MDX, **Astro**), the Svelte language
server, Angular's template engine, typescript-eslint, ts-morph, custom transformers — break against
the Go compiler. **[V]** — [byteiota](https://byteiota.com/typescript-7-go-native-compiler/),
[TypeScriptPro](https://typescriptpro.com/blog/typescript-version-7-2026-07-08)

`astro check` runs the Astro language server, which is exactly such a consumer. That is the blocker,
and it is not a workaround-able one.

## What we would gain, and why it is small

Astro 7 already ships a Rust `.astro` compiler, plus a Rust Markdown pipeline and Vite 8 with
Rolldown — builds 15–61% faster. **[V]** — [Astro 7.0](https://astro.build/blog/astro-7/)
So the compile-speed win is already banked. TypeScript 7 would only accelerate `astro check`, which
on a landing site is a ~2 second operation. **[I]**

## Migration cost when it does land

TS 7.0 carries real breaking changes independent of the API question: `strict` on by default,
`module` defaulting to `esnext`, and deprecated flags (`target: es5`, `baseUrl`,
`moduleResolution: node`) becoming hard errors. **[W]** — asserted by the Claude-web session, not
independently verified.

This repo's `tsconfig.json` extends `astro/tsconfigs/strict`, which pre-adapts it to most of those
defaults, so the eventual migration should be cheap. **[I]**

## Recommendation

Stay on TypeScript 6.x. Revisit when **both** conditions hold:

1. TypeScript 7.1 has shipped with the stable programmatic API, and
2. `@astrojs/language-server` has announced support for it.

Neither is worth polling. Check when 7.1 is announced.

## Open for research

- [ ] Confirm the 7.0 breaking-change list (`strict` default, `module: esnext`, removed flags)
      against the TypeScript release notes rather than secondary coverage. **[W]**
- [ ] Watch for an `@astrojs/language-server` statement on TS 7 support — that is the actual gate.
