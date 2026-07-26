# Zod in Astro content collections

**Date:** 2026-07-26 · **Source:** [astro-tips.dev Zod tip](https://astro-tips.dev/tips/leverage-zod-s-power/),
fetched 2026-07-26
**Status:** applicable when content moves into a collection. Nothing in `src/content/` yet.

See [`README.md`](README.md) for provenance markers.

---

## 1. The three techniques

All plain Zod, applied to a `defineCollection` schema. **[V]** — page as fetched, via a summarising
fetch; the exact snippets are **not** transcribed and are unchecked against Astro 7.

| Technique | What it buys |
| --------- | ------------ |
| `z.preprocess` | Rewrite a value **before** validation — their example prepends an asset path alias so every entry stops repeating it |
| `.transform` | Reshape **after** validation — their example turns `{latitude, longitude}` into a `[lng, lat]` tuple for Mapbox |
| `.refine` | Custom predicate + custom message — their example rejects a cover image narrower than 1080px |

## 2. Which of these earn their keep here

**`.refine` is the one that matters.** It converts an art-direction rule into a build failure. An
undersized hero image caught by `astro build` is worth more than the same rule written in a style
guide nobody rereads. Same for a Turkish-content rule: every entry needs its English mirror, or a
`birim` slug must be one of the six known units. **[I]**

**`.transform` is a trap at the boundary.** It changes the type flowing out of the collection, so
the schema stops describing what an author writes in the file. Use it where the on-disk shape and
the consumed shape genuinely differ; do not use it to paper over a badly chosen frontmatter key —
fix the key. **[I]**

**`z.preprocess` should be rare.** It runs before validation, so a preprocess bug produces a
confusing error about a value the author never wrote. **[I]**

This is the same parse-don't-just-validate posture the house TypeScript rules already take: the
schema is the parser at the content boundary, and everything downstream consumes the parsed type,
never the raw frontmatter. **[I]**

## 3. Version gap — resolve before writing a schema

**Which Zod major does Astro 7 take, and does `image()` still behave as shown?** The tip is written
against an older Astro. Zod 4 changed `z.preprocess`, error customisation (`message` →
`error`), and `.refine` semantics enough that a snippet written for Zod 3 can be silently wrong
rather than loudly broken. **[G]** — unverified, 2026-07-26.

Do not copy any snippet from that page. Check Astro 7's own content-collections docs and the Zod
version actually resolved in `bun.lock` first. **[I]**

## Open for research

- [ ] Zod major version accepted by Astro 7 content collections; whether the project pulls it
      transitively or must declare it. **[G]**
- [ ] Current `image()` semantics in an Astro 7 schema, and whether `.refine` still sees width and
      height on the parsed value. **[G]**
