# Linting: Biome vs ESLint + Prettier

**Date:** 2026-07-26 · **Split from `astro-stack-2026.md` 2026-07-26**
**Versions pinned:** Biome 2.5.2 (released 2026-07-01) for §1–§4; **2.5.5** for §6, the version
installed here. Astro 7.1.3.
**Status:** settled — Biome alone. See [`README.md`](README.md) for provenance markers.

**Changed 2026-07-26:** added §6, closing the `overrides[].includes` gap by running the binary.
Formatting of `.astro` templates moved to its own file,
[`formatting-astro-templates.md`](formatting-astro-templates.md) — it is a different question and
was pulling this file off-topic. Nothing in §1–§5 was overwritten.

---

## 1. The premise "Biome is not type-aware" is stale

Biome v2.0 ("Biotype", June 2025) shipped type-aware lint rules built on Biome's **own type
inference engine**, not on `tsc`. Type-aware rules live in a `types` **domain**; enabling the domain
turns on the Scanner, which builds the module graph and inferred types across the project. **[V]**
— [Biome v2](https://biomejs.dev/blog/biome-v2/), [Roadmap 2026](https://biomejs.dev/blog/roadmap-2026/)

Coverage numbers Biome published for `noFloatingPromises`, measured against typescript-eslint as the
reference implementation:

| Version | Share of typescript-eslint's detections reproduced |
| ------- | -------------------------------------------------- |
| 2.0 | ~75% |
| 2.1 | ~85% (adds getters, call signatures, comma operator) |

**[V]** — [Biome v2](https://biomejs.dev/blog/biome-v2/), [Biome v2.1](https://biomejs.dev/blog/biome-v2-1/)

Current line is **2.5.2** (2026-07-01); v2.5 promoted 70+ rules, some type-aware, and added
cross-file rules over the module graph (`noUndeclaredClasses`, `noUnusedClasses`). Total rule count
crossed 500. **[V]** — [Biome v2.5](https://biomejs.dev/blog/biome-v2-5/)

No published post-2.1 coverage figure exists. **[G]** Treat 85% as a floor, not a current number.

## 2. What is in the missing slice, and does it touch us

The residual gap is not a documented list. **[G]** Structurally, an inference engine that is not
`tsc` will lag on exactly the things "complex types" means:

- conditional types, `infer`, deep generic instantiation
- mapped and template-literal types
- declaration-merged and heavily overloaded third-party `.d.ts`
- brands implemented as intersection with a unique symbol — the Ulus house pattern **[I]**

The rules where type information is the *only* thing that catches the bug — typescript-eslint's
typed rules with no untyped equivalent:

- `no-floating-promises` — an un-awaited async call, silently unhandled rejection
- `no-misused-promises` — an async callback in a slot expecting a sync predicate, so the value tested
  is a Promise and therefore always truthy
- `no-unnecessary-condition` — a truthiness check on a value the narrowed type says can never be
  falsy; dead branches left behind by a refactor
- `restrict-template-expressions` — an object interpolated into a template literal, yielding
  `[object Object]`
- `no-unsafe-argument` / `-assignment` / `-return` — the `any` firewall, where an untyped
  `JSON.parse` result flows into a typed API unchecked

**The asymmetry that matters:** `tsc` itself already rejects most brand violations. Passing a bare
`string` where a `BirimSlug` is expected is a compile error with or without a linter. What the linter
adds is only the `any`-leak and floating-promise axes — everything else on that list is a refinement
of checks `astro check` is already running. Type-aware linting is a **supplement** to
`tsc --noEmit`, never a substitute. **[I]**

## 3. The `.astro` question, which dominates everything above

Both tools are weak inside `.astro`, and this is the decisive fact:

- **Biome** — `.astro`, `.vue`, `.svelte` supported since **2.3**, marked **experimental (🟡)**.
  Biome does no language-specific parsing for the framework syntax; formatting may not match
  expectations and "lint rules might not detect some cases". Cross-embedded-language rules are not
  supported yet. Docs recommend `overrides` disabling `useConst`, `useImportType`,
  `noUnusedVariables`, `noUnusedImports` on `.astro` to avoid false positives. **[V]** —
  [Language support](https://biomejs.dev/internals/language-support/),
  [Biome v2.3](https://biomejs.dev/blog/biome-v2-3/)
- **ESLint** — `eslint-plugin-astro` + `astro-eslint-parser` handle the template properly, but typed
  linting requires pointing `parserOptions.project` at a `tsconfig.eslint.json`, and virtual
  TypeScript inside Astro components (`**/*.astro/*.ts`) is **excluded from type-aware linting**.
  **[V]** — [eslint-plugin-astro user guide](https://ota-meshi.github.io/eslint-plugin-astro/user-guide/),
  [withastro/astro#11315](https://github.com/withastro/astro/pull/11315)

**Neither tool gives full type-aware linting of `.astro` frontmatter.** The type-aware delta between
them therefore applies only to plain `src/lib/**/*.ts` — the smaller half of a landing site. **[I]**

## 4. When the gap actually binds on this repo — not yet

As of 2026-07-26 `src/` holds `pages/index.astro`, `i18n/ui.ts`, `i18n/utils.ts`, and
`components/LanguagePicker.astro`. The `.ts` surface is two small modules and may stay near-empty:
content-collection schemas, URL helpers, the segment map.

So the honest answer to "when does it become a problem for us" is: **it does not, at the repo's
current shape.** **[I]**

Trigger condition, stated so it can be checked rather than guessed at:

> If `src/lib/**/*.ts` grows past trivial — async data loading, an API client, branded parsers with
> real control flow — *then* evaluate adding ESLint as a second, narrow, typed-only pass over that
> directory. Not before.

That pass, if it ever happens: `typescript-eslint` `recommendedTypeChecked` scoped to
`src/lib/**/*.ts`, formatting left entirely to Biome (no `eslint-config-prettier` needed — no ESLint
stylistic rules enabled). Additive and reversible. Migrating Biome → ESLint+Prettier wholesale is
not. **[I]**

## 5. Recommendation

Stay on Biome, alone. Formatter + linter + import sort in one Rust binary, one config file, no plugin
supply chain — the lower-lock-in choice, and it matches the house toolchain.

Config facts, verified 2026-07-25:

- The type-aware domain key is **`types`**, under `linter.domains`. Accepted values: `"recommended"`
  (all recommended non-nursery rules in the domain), `"all"` (including nursery), `"none"`. Enabling
  it activates the inference engine, which costs analysis time. **[V]** —
  [Domains](https://biomejs.dev/linter/domains/)
- `noFloatingPromises` is in the **`nursery`** group and the **Types** domain, and is **not**
  recommended by default — enable it explicitly, or use `"types": "all"`. **[V]** —
  [noFloatingPromises](https://biomejs.dev/linter/rules/no-floating-promises/)
- The `.astro` overrides disabling `useConst`, `useImportType`, `noUnusedVariables`,
  `noUnusedImports` are the documented workaround for false positives. **[V]**

`astro check` in CI is the actual type safety. The linter is a supplement.

## 6. The `.astro` overrides, verified against the binary — 2.5.5

Everything here was run, not read. Biome 2.5.5, this repo's config, 2026-07-26. **[V]**

**The false positives are real and reproduce.** A test component with `const x` and `let y` used
*only* in the template (`<p>{x}</p>`, `<span>{y}</span>`) and a `import type { Foo }` gets three
findings: `correctness/noUnusedVariables` ×2 and `correctness/noUnusedImports`. Biome reads the
frontmatter without the template, so anything consumed only by markup looks dead.

**This repo currently has no `.astro` overrides**, and it is already paying for it:
`src/components/LanguagePicker.astro:6` reports `noUnusedImports` on an import the template uses.

**The documented override block still validates at 2.5.5, key names and rule groups intact:**
`overrides[].includes` is the correct key (not `include`), `useConst` and `useImportType` are still
in **`style`**, `noUnusedVariables` and `noUnusedImports` still in **`correctness`**. Applying it
silences all three findings on the test component. **[V]** — closes the open `[G]`.

**And it does not mask the real bugs.** Re-run against this repo with the override merged into the
actual `biome.json`: `LanguagePicker.astro:6` disappears, while every `src/i18n/utils.ts` finding —
four `suspicious/noRedeclare`, one `correctness/noUnusedImports`, one `style/useTemplate` — survives
untouched, because the override is scoped `**/*.astro`. **[V]** — run 2026-07-26. The blast radius
is `.astro` frontmatter only.

**Two adjacent config facts found the same way:** **[V]**

- Root keys accepted at 2.5.5: `$schema`, `root`, `extends`, `vcs`, `files`, `formatter`, `linter`,
  `javascript`, `json`, `css`, `graphql`, `grit`, `html`, `overrides`, `plugins`, `assist`. The
  v1-era top-level `organizeImports` is gone — it now lives under `assist.actions.source`, which is
  where this repo already has it.
- `linter.rules.recommended: true` is **deprecated** and warns, to be removed next major. `preset`
  is the replacement — again, what this repo already uses. Any snippet still showing `recommended`
  predates 2.5.

**Cost of the override.** It is a real hole, not a cosmetic one: an import genuinely left behind by
a refactor in an `.astro` frontmatter will no longer be reported. `astro check` is what still
catches unused-symbol problems there. The alternative — leaving the rules on and reading past the
noise — is worse, because noise that is always present stops being read. **[I]**

## Open for research

- [x] ~~Biome 2.5.2 `overrides[].includes` schema key, and which rule group each `.astro`
      false-positive rule belongs to.~~ Settled in §6 against 2.5.5, 2026-07-26.
- [ ] Biome type-inference coverage past v2.1. No figure published. Low priority. **[G]**
- [ ] Whether Biome's `.astro` support has left experimental status in any release after 2.5.5.
      Still 🟡 as of 2026-07-26. **[G]**
