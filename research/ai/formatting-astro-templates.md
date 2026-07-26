# Formatting `.astro` templates — do we need Prettier?

**Date:** 2026-07-26
**Versions pinned:** Biome 2.5.5, Astro 7.1.3, prettier 3.9.6, prettier-plugin-astro 0.14.1
**Status:** answers one question. The Biome-vs-ESLint decision is settled elsewhere —
[`linting-biome-astro.md`](linting-biome-astro.md). This file does not reopen it.

See [`README.md`](README.md) for provenance markers.

---

## 1. The finding

**Biome 2.5.5 formats only the frontmatter of an `.astro` file. The template markup, the inline
`<style>`, and the inline `<script>` are left byte-identical.** **[V]**

Verified by running the binary, 2026-07-26, with this repo's `biome.json`:

- Input: messy frontmatter, `<div    class="a"      id="b">`, unindented `<p>`, collapsed
  `<ul><li>…`, `.a{color:red;background:blue}`, `const  z   =   1; console.log(z)`.
- `biome format --write` output: frontmatter normalised (quotes, semicolons, import spacing).
  Everything from `---` onward unchanged, verified with `diff`.

This survives the `html` opt-in. Re-run with `{"html": {"formatter": {"enabled": true}}}` — the
`.astro` output is identical. **[V]**

Control, same config, same content saved as `.html`: Biome formats it fully — tabs applied, `<ul>`
expanded one `<li>` per line, CSS block expanded, JS normalised. **[V]** So the HTML formatter
works; `.astro` files are simply not routed through it.

**A silver lining in that gap.** The control run rewrote `<p>{x}</p>` into `<p>{ x}</p>`. Biome's
HTML formatter treats `{x}` as text and pads it. If it ever *did* apply to `.astro`, it would
corrupt every expression in the template. Its non-application is currently protective, not merely
absent. **[I]**

## 2. What this contradicts, and what it confirms

**Confirms** the astro-tips.dev Biome page, written for Biome v1.6: *"Linting and Formatting is
available for the component script of any `.astro` file"* — template formatting needs Prettier.
Still exactly true nineteen months and one major version later. **[V]**

**Sharpens** Biome's own language-support table, which shows Astro as 🟡 across parsing / formatting
/ linting since 2.3 with the note that formatting "might not match the desired expectations."
**[V]** — [Language support](https://biomejs.dev/internals/language-support/). Read at face value
that suggests imperfect template formatting. Measured, it is *no* template formatting. The 🟡 is
about the embedded JS/CSS Biome extracts, not about the Astro template.

## 3. The actual options

| Option | Template markup | Cost |
| ------ | --------------- | ---- |
| **A. Biome alone** (status quo) | Never formatted; whatever was typed is what ships | Zero. Consistency is on the author |
| **B. Biome + editor-only Prettier** | Formatted on save in VS Code | Zero deps. Not enforceable in CI, not present in Neovim |
| **C. Biome + `prettier` + `prettier-plugin-astro`, scoped to `**/*.astro`** | Formatted, enforceable in CI | Two dev deps, a second config, and a boundary to police |

**Option B is available but not configured.** `.vscode/extensions.json` recommends
`astro-build.astro-vscode`; there is **no `.vscode/settings.json`** in this repo, so nothing sets a
default formatter for `.astro` or turns on format-on-save. **[V]** — repo inspected 2026-07-26. The
capability rides on whoever happens to have the extension installed.

Astro's docs state that the VS Code extension bundles Prettier formatting, and that the standalone
plugin is what adds `.astro` formatting outside the editor (CLI) or in editors without Astro's
tooling. **[W]** — [Editor setup](https://docs.astro.build/en/editor-setup/), reached through a
summarising fetch rather than read verbatim. This sentence is what makes option B exist; confirm it
against the rendered page before leaning on it.

Consequence, if that holds: templates are formattable in VS Code today, and not in Neovim/LazyVim,
and not in CI. **[I]** Bilgehan uses both editors — that split is the whole decision.

## 4. Recommendation

**A, for now.** A landing site's `.astro` templates are read constantly and written rarely; a
formatter is not what keeps them tidy at this size. Adding Prettier back to a repo whose stated
tooling decision is "Biome alone, no Prettier" buys markup indentation and costs the single-tool
property.

**Escalate to C when either trigger fires**, not before: **[I]**

1. A second person writes `.astro` in this repo, or
2. Diff noise from re-indented markup appears in review more than once.

If C ever happens, the shape is: `prettier` + `prettier-plugin-astro` as dev deps, a `.prettierrc`
whose `overrides` set `parser: "astro"` for `*.astro`, a `.prettierignore` covering everything else,
and Biome untouched — the two tools must never both claim a file. Biome would keep the frontmatter
if invoked after Prettier, so **order matters and only one may run in CI**. Sketch, not a
configuration. **[I]**

**Not `prettier-plugin-tailwindcss`** — astro-tips pairs the two; no Tailwind here.

## 5. Staleness note on the plugin, which is not disqualifying

`prettier-plugin-astro` is at **0.14.1, published 2024-05→2024-07** — two years without a release
as of 2026-07-26. **[V]** — npm registry, checked 2026-07-26.

Stale is not broken; the same code is what ships inside the VS Code extension, which Astro's docs
actively recommend. But whether 0.14.1 parses **Astro 7** template syntax without damage is
**unverified** — the plugin predates Astro 5. **[G]** Settle that with a real run against a real
page before choosing option C. Do not choose C on the assumption that it works.

## Open for research

- [ ] Does `prettier-plugin-astro@0.14.1` round-trip an Astro 7 template unchanged? Run it against
      `src/pages/index.astro` and diff. Blocks option C. **[G]**
- [ ] Is there an upstream Biome issue tracking `.astro` template formatting, and is it on the
      2026 roadmap? Would date option A's expiry. **[G]**
- [ ] Confirm the Astro editor-setup sentence verbatim and promote it `[W]` → `[V]`, or drop
      option B. **[W]**
