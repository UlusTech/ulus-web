# i18n: translated route segments, no locale prefix

**Date:** 2026-07-26 · **Split from `astro-stack-2026.md` §6.2; supersedes that doc's §3 i18n line**
**Versions pinned:** Astro 7.1.3, `@astrojs/sitemap` 3.7.3 (both confirmed installed, `bun.lock`
2026-07-26)
**Status:** approach settled, nothing built. See [`README.md`](README.md) for provenance markers.

---

## The requirement

Turkish-primary with English as a co-equal mirror, and **no `/en/` prefix**. URLs look like:

```
ulus.me/üst-yönetim-kurulu/bilgehan
ulus.me/the-high-assembly/bilgehan
```

Bilgehan's stated position: `/en/*` treats Turkish as unmarked and English as a bolt-on, which is
backwards for Ulus.

## Why Astro's built-in i18n is the wrong instrument

`astro:i18n` solves **locale prefixing** (`/es/…`, `/fr/…`). The requirement is **translated
segments**. Different problem — and the built-in feature has no mode that produces the second from
the first. **[I]**

`i18n.domains` — the multi-domain route — is closed off by a hard constraint, not taste:

> `i18n.domains` requires `output: "server"` plus an adapter, "with no prerendered pages". Its
> documented limitations: `site` mandatory, `output` must be `"server"`, no individual prerendered
> pages. **[V]** — [Internationalization](https://docs.astro.build/en/guides/internationalization/),
> [Config reference](https://docs.astro.build/en/reference/configuration-reference/)

So `ulus.org.tr` / `ulus.org.uk` as locale domains is **off the table while static**. If it is ever
wanted, the answer is N static builds of one repo with `site` and a default-language flag as
build-time env vars — cleaner than `i18n.domains` and it works with static output. **[I]** Parked by
decision 2026-07-26.

### Resolved 2026-07-26: the heading artifact was real, custom locale paths are not restricted

Previously `[G]`: the limitations block appears nested under a "Custom locale paths" heading, and it
was unclear whether the `output: "server"` restriction belonged to *paths* or to *domains*.

**It belongs to `domains`.** The artifact is now demonstrated rather than guessed at: **[V]**

- The same "Custom locale paths" heading also carries this, verbatim — *"relies on `X-Forwarded-Host`
  (or `Host`) and `X-Forwarded-Proto` (or `URL#protocol`) headers… failure to retrieve these headers
  will result in a 404 status code page."* Host-header negotiation is **domain** routing. Custom
  locale paths are a `path`/`codes` alias map and never touch request headers. Content from the
  `domains` section is provably sitting under that heading. **[V]** —
  [internationalization.mdx](https://github.com/withastro/docs/blob/main/src/content/docs/en/guides/internationalization.mdx)
  via Context7, 2026-07-26
- Astro's own `domains` example carries the inline comment `output: "server", // required, with no
  prerendered pages` — the restriction is attached to `domains` at its own source. **[V]** same page
- The custom-locale-paths reference (`getPathByLocale`, `astro-i18n.mdx`) documents the `path`/`codes`
  form with **no output-mode restriction stated**, as does the configuration reference. **[V]**

**[I]** So custom locale paths are static-safe. Graded an inference, not a fact: absence of a stated
restriction is weaker than a statement of support, and no page says "works with `output: 'static'`"
outright.

**A caution that cost real time here.** A summarising fetch of the rendered page asserted the
opposite — that the limitations apply "exclusively to custom locale paths" — because the summariser
read the same heading nesting and resolved it the other way. Two independent extractions of this page
disagree about which feature owns that block. Prefer the MDX source over any rendering of it when
attribution matters. **[I]**

**It still does not change the recommendation.** Custom locale paths map several *language codes* to
one path (`fr`, `fr-BR`, `fr-CA` → `french`). They do not translate the segment per language, which
is the actual requirement. Being available is not being useful.

## Astro's official i18n recipe does not solve this either

Reviewed 2026-07-26 against `src/i18n/ui.ts`, `src/i18n/utils.ts`, `src/components/LanguagePicker.astro`,
copied from [the recipe](https://docs.astro.build/en/recipes/i18n/). Two structural blockers, plus
independent defects. Not an i18next question — no i18next package is involved.

### Addendum, same day: the config block the first review missed

`astro.config.mjs` now carries an `i18n` block — `defaultLocale: "tr"`, `locales: ["en", "tr"]`,
`routing.prefixDefaultLocale: false`. **[V]** — read 2026-07-26. It is **working-tree only,
uncommitted**, as are `src/i18n/` and `src/components/`; the last commit touching that file is
`6780877 init`, where it was an empty `defineConfig({})`. So this is the same experiment the review
above covers, and the review simply stopped at three files when there were four.

What the block does, stated plainly: **[I]**

- `prefixDefaultLocale: false` produces `/hakkimizda` for Turkish and `/en/about` for English. That
  is the prefix model. It is the thing this requirement rules out, not a step toward it.
- It is also the *only* part of the experiment that is a framework-level commitment rather than
  copied application code. `ui.ts` and `utils.ts` can be rewritten freely; enabling `astro:i18n`
  changes how Astro itself resolves routes, and anything built on top inherits that model.

**The two halves disagree with each other**, which is worth naming on its own: the config declares
`locales: ["en", "tr"]` while `utils.ts` derives language by testing path segment 0 against the `ui`
table. Two independent locale sources that can drift, and neither of them is the segment map this
file recommends as the single source. **[I]**

This does not change the recommendation below; it extends the same finding to a fourth file. What is
genuinely undecided is whether *any* part of `astro:i18n` is worth keeping alongside a hand-rolled
segment map — `Astro.currentLocale`, `getRelativeLocaleUrl`, and the `locales` list itself all become
either unused or actively misleading once routing is hand-rolled. **[G]** Not researched: whether
enabling the block with no prefix has side effects on the static build (route collision, duplicate
emission) when a catch-all `[...path].astro` is also present. That is the question worth answering
before subtask 4 starts, and it is empirical, not a search.

**Structural — the recipe cannot express the requirement:**

1. **It is prefix-based.** `useTranslatedPath` returns `/${l}${translatedPath}` for any non-default
   language. Turkish gets `/servisler`, English gets `/en/services`. `showDefaultLang` only strips
   the prefix from the *default* language; there is no setting that yields `/the-high-assembly`.
2. **`getLangFromUrl` reads language from path segment 0.** Given `/the-high-assembly/bilgehan` it
   tests `"the-high-assembly" in ui` → false → returns the default, `"tr"`. **English pages would
   report Turkish**, poisoning `<html lang>`, `hreflang`, OG locale, and Pagefind's
   language-dependent stemming. With translated segments there is no language in the URL at all —
   it has to come from `getStaticPaths` props, or from reverse-looking-up the matched segment.

**Independent defects in the copied code:**

- `ui.ts` — `ui.en` has a `nav.twitter` key that `ui.tr` lacks. `t` is typed
  `keyof (typeof ui)[typeof defaultLang]`, i.e. Turkish keys only, so `t('nav.twitter')` is a type
  error despite the string existing. The runtime fallback (`key in localizedUI ? … : ui[defaultLang][key]`)
  papers over what the types should forbid. House style says the opposite: make Turkish the source
  of truth and require every other language to satisfy the same key set, so a missing translation is
  a compile error rather than a silent fallback to Turkish text on an English page.
- `utils.ts` — `path.replaceAll("/", "")` flattens `/a/b` to `"ab"`. Single-segment paths only;
  breaks on `/üst-yönetim-kurulu/bilgehan`.
- `utils.ts` — typing the localized table as `Record<string, string>` discards the literal keys,
  defeating the typing above it.
- `ui.ts` — `routes` is not `as const` while `ui` is; inconsistent, loses literal types.
- `LanguagePicker.astro` — links to `/${lang}/`, the site **root** in that language. Clicking
  "English" on a person's page lands on the homepage instead of that person's English URL.

## The approach that does work

One map keyed by concept, with a column per language. Language is determined by which column
matched, never by sniffing the URL. `getStaticPaths` emits both languages from one content file and
passes the language as a prop.

The same map is the single source for five things, which is the point — they cannot drift:

1. the route table
2. `hreflang` + `x-default` in the `<SEO />` component
3. sitemap URL enumeration
4. the language picker's counterpart lookup (swap the segment, preserve the rest of the path)
5. the ASCII → UTF-8 redirect map

The UI-strings table from the recipe is worth keeping once its key-parity typing is fixed. The path
helpers and the language picker are not salvageable.

## Consequence the earlier research got wrong

`@astrojs/sitemap`'s `i18n` option emits `xhtml:link` alternates by matching **path prefixes**
(`/es/`, `/fr/`). With translated segments there is no prefix to match, so **that option does not
apply and `hreflang`/`x-default` become hand-rolled** in the `<SEO />` component. The sitemap
integration still earns its place for URL enumeration.

**Promoted `[I]` → `[V]` on 2026-07-26.** The integration's docs state the mechanism outright:
*"The key is used to look for a locale part in a page path."* Locale membership is derived from the
path, with no per-page mapping hook. **[V]** —
[Sitemap integration](https://docs.astro.build/en/guides/integrations-guide/sitemap/)

The escape hatch was checked and does not close the gap: `filter()` only **removes** URLs, and
`serialize()` is documented as returning "a `SitemapItem` or `undefined`" with examples covering
`changefreq`, `lastmod` and `priority` — **whether it can add or rewrite `xhtml:link` alternates is
not documented either way**. **[G]** Worth one experiment before the `<SEO />` component is written,
since a working `serialize()` would put alternates in the sitemap as well as the head; but plan for
hand-rolled, because that is what the documented surface supports.

## Slug form

Decided 2026-07-26: **canonical is UTF-8** (`/üst-yönetim-kurulu`), with the ASCII fold
(`/ust-yonetim-kurulu`) as an alias that **301s to the canonical**. Movement is ASCII → Turkish.

Consequences to accept:

- Static output emits no real 301s without host support, so **the alias map lives in the Caddyfile**,
  splitting the route table across two files. Mitigation: generate that block from the segment map at
  build time so the two cannot drift. **[I]**
- **The ASCII fold is not injective** — `ı→i` collides with `i→i`. Two distinct Turkish segments can
  fold to the same ASCII string, producing an ambiguous redirect. With a hardcoded segment map this
  is checkable: the generator must assert no collisions and fail the build. **[I]**
- Aliases must be **excluded from the sitemap**, or the site publishes duplicate content pointing at
  its own canonical. **[I]**
- Turkish casing: `toLowerCase()` mishandles dotted/dotless `i`. Hardcode slugs in the map; never
  generate them from titles. **[W/I]**

## Open for research

- [x] ~~Custom locale *paths* vs `i18n.domains` — is the static-output restriction really scoped to
      `domains` only?~~ **Resolved 2026-07-26: yes.** The heading artifact is demonstrated by
      misfiled `X-Forwarded-Host` content **[V]**; custom locale paths are static-safe **[I]**. Moot
      regardless — they alias language *codes* to one path, not segments per language.
- [ ] Does Caddy write `Location:` percent-encoded when redirecting to a target containing Turkish
      characters (`/%C3%BCst-y%C3%B6netim-kurulu/…`)? Blocks the alias map. **[G]**
- [x] ~~`@astrojs/sitemap` — confirm the `i18n` option is prefix-based.~~ **Resolved 2026-07-26,
      `[V]`:** *"The key is used to look for a locale part in a page path."* `hreflang` is
      hand-rolled.
- [ ] Can `serialize()` add or rewrite `xhtml:link` alternates per URL? Undocumented either way;
      `filter()` only removes. One experiment, worth running before `<SEO />` is written. **[G]**
- [ ] Pagefind's Turkish stemming quality on agglutinated forms (`yönetim` / `yönetimi` /
      `yönetimde`). Empirical, needs a built index. See [`tooling-packages.md`](tooling-packages.md).
- [ ] Does enabling `i18n` in `astro.config.mjs` with `prefixDefaultLocale: false` interfere with a
      catch-all `[...path].astro` under static output — route collision, duplicate emission, or
      nothing? Empirical. Blocks subtask 4. **[G]**
- [ ] Is any part of `astro:i18n` worth keeping beside a hand-rolled segment map
      (`Astro.currentLocale`, `getRelativeLocaleUrl`), or does enabling it only add a second locale
      source that can drift from the map? **[G]**
