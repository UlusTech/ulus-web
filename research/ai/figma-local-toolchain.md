# Figma local toolchain — MCP server, VS Code extension, Code Connect

**Date:** 2026-07-26 · **Status:** research — not yet promoted to `.context/`
**Scope:** the local wiring between Figma, an editor, and an AI coding agent. Entitlement/pricing depth
is covered by a sibling file, [`figma-plans-and-entitlement.md`](figma-plans-and-entitlement.md) —
cross-reference, don't duplicate.

**This file owns editor and agent wiring** — MCP server, VS Code, Code Connect mechanics, codegen
output. See the fact-ownership table in [`README.md`](README.md).

Provenance markers per [`README.md`](README.md): `[V]` verified against primary source, `[I]`
inference, `[G]` gap, `[W]` non-primary source and not independently checked.

> **Changed 2026-07-26 (sync pass, same day):** the Answer's WSL2 bullet asserted mirrored mode
> "does not fully solve the problem" as a finding, while §1.5 correctly grades it a single
> uncorroborated forum report — the headline now matches the body. §1.5's forward reference ("if the
> sibling entitlement file finds…") was dangling; the sibling now exists and answers the plan half,
> leaving the seat half open at global rank 2. No claim's substance or grading changed.

---

## Answer, up front

- The **Dev Mode MCP server has two deployment modes**: a **remote** hosted server at
  `https://mcp.figma.com/mcp` (no desktop app needed) and a **local desktop server** at
  `http://127.0.0.1:3845/mcp`, hosted inside the running Figma desktop app. `[V]`
- Figma's own docs now **recommend the remote server over the desktop one** — "provides the broadest
  set of features." `[V]`
- **Real tool names exist and were confirmed against the primary tools-and-prompts page** — see
  table below. `get_code` is a **wrong-era name**: a Figma forum post confirms Figma renamed it to
  `get_design_context`, consistent with its absence from the current docs page. `get_image` is
  unconfirmed as ever having existed under that name. `get_code_connect_map` is current and real. The
  docs page annotates tools **per-tool** as remote-only or available on both — it is not split into
  separate desktop/remote sections, and the desktop server is missing a real subset of tools
  (`whoami`, `use_figma`, `search_design_system`, asset upload/download, others), not just "narrower"
  in a vague sense. `[V]`
- **WSL2 + mirrored networking: unresolved, and the evidence is thin.** Mirrored mode should fix the
  localhost-forwarding half; **one** forum poster reports it breaks WSL↔VS Code connections. That is
  a single uncorroborated source, not a finding — stated here as an open risk, not as a conclusion.
  `[W]`, needs an empirical test. See §1.5. The remote server sidesteps the question entirely.
- **Code Connect is component-shaped and requires a Dev/Full seat on Organization or Enterprise.**
  It maps Figma nodes to real component code (React, HTML custom elements/Angular/Vue, SwiftUI,
  Compose). It explicitly does **not** work on plain, component-less static markup — a framework-less
  hand-authored HTML/CSS site "would not work meaningfully" with it, per Figma's own HTML docs. `[V]`
  **For ulus-web (Astro 7, static, hand-written CSS, no framework, no component library): Code
  Connect is not a fit as designed.** `[V+I]`
- **Default codegen from `get_design_context` is React + JSX + Tailwind**, regardless of prompted
  framework — the framework/language parameters do not change the underlying output; a client is
  expected to translate it. Frames without auto-layout emit absolute positioning. `[W]` (forum post,
  not Figma docs — flagged below, worth re-verifying before depended on).

---

## 1. Figma Dev Mode MCP server

### 1.1 Transport and endpoints

| Mode | Endpoint | Needs desktop app running? | Docs status |
| --- | --- | --- | --- |
| Remote | `https://mcp.figma.com/mcp` | No | "Recommended" `[V]` |
| Local/desktop | `http://127.0.0.1:3845/mcp` | Yes | Still supported, narrower feature set `[V]` |

Source: Figma Developer Docs, "Guide to the Figma MCP server" (help.figma.com) and "Set up the desktop
server" (developers.figma.com/docs/figma-mcp-server/local-server-installation). `[V]`

The desktop server uses the `http` transport at `/mcp` (this is the literal `--transport http` flag
value Claude Code's own setup command uses, §1.4) — the fetched setup doc characterized it only as
"HTTP (not SSE or streamable HTTP)" without further protocol detail. An older `/sse` path is
referenced in some now-stale third-party guides; treat `/sse` as legacy and `/mcp` as current. `[V]`
for the endpoint and transport flag, `[I]` for the `/sse`-is-legacy framing.

The Figma desktop app also serves an assets endpoint at `/assets/*` on the same port (3845) for image
retrieval used by tools like `get_screenshot` / `download_assets`. `[W]` (seen in multiple secondary
write-ups, not independently confirmed against a primary page describing the assets route specifically
— treat as plausible, not certain).

Desktop server activation: open a file, toggle Dev Mode, enable "Dev Mode MCP Server" from
Figma → Preferences (desktop app menu). `[V]`, help.figma.com "Guide to the Figma MCP server."

### 1.2 Tool list — verified against `developers.figma.com/docs/figma-mcp-server/tools-and-prompts/`

The page uses **one unified list** under a single "Tools" heading, not separate Desktop/Remote
sections — confirmed by direct query against the page's own heading structure. Each tool instead
carries an inline annotation, `(remote only)` (or the narrower `(specific clients only, remote
only)`), or no annotation at all, meaning available on **both** desktop and remote. `[V]`

| Tool | Description (as documented) | Availability |
| --- | --- | --- |
| `get_design_context` | Generates code from a design selection (React+Tailwind by default); supports selection-based prompting | Both (selection-prompting sub-mode reported desktop-only by secondary sources — not itself annotated on the page) `[V/W]` |
| `get_code_connect_map` | Retrieves component mappings between Figma and codebase | Both |
| `get_code_connect_suggestions` | Detects/suggests Code Connect component mappings | Both |
| `get_context_for_code_connect` | Retrieves context for generating Code Connect templates | Remote only |
| `add_code_connect_map` | Adds a mapping between a Figma node ID and code component | Both |
| `send_code_connect_mappings` | Confirms Code Connect mappings after suggestions | Both |
| `get_variable_defs` | Returns variables/styles used in the current selection | Both |
| `get_metadata` | Sparse XML representation of a selection's basic properties | Both |
| `get_screenshot` | Screenshot of the current selection | Both |
| `get_motion_context` | Keyframe animation data for an animated node | Both |
| `get_shader_effect` / `get_shader_fill` / `list_shader_effects` / `list_shader_fills` | Shader asset retrieval | Both |
| `get_libraries` | Libraries added to / available for the file | Remote only |
| `search_design_system` | Searches connected libraries for components/variables/styles | Remote only |
| `download_assets` | Export rendered assets | Remote only |
| `upload_assets` | Import assets | Remote only |
| `get_figjam` | FigJam board to XML, with screenshots | Both |
| `generate_diagram` | FigJam diagram from Mermaid syntax | Remote only |
| `generate_figma_design` | Sends live UI as design layers to a Figma file/clipboard | Remote only (specific clients only) |
| `create_new_file` | Creates a blank Design/FigJam/Slides file | Remote only |
| `use_figma` | General-purpose create/edit/inspect on file objects | Remote only |
| `whoami` | Identity of the authenticated Figma user | Remote only |

All names, descriptions, and per-tool annotations above `[V]`, fetched directly from that page.

**Practical read for the desktop server (`127.0.0.1:3845/mcp`, §1.1):** it exposes the "Both" rows
above and excludes every "Remote only" row — `whoami`, `use_figma`, `create_new_file`,
`get_libraries`, `search_design_system`, `download_assets`/`upload_assets`, `generate_diagram`,
`generate_figma_design`, and `get_context_for_code_connect` are **not** available through the desktop
server at all. This is a real capability gap, not just a vague "broader feature set" framing on
Figma's part. `[I]`, drawn directly from the per-tool annotations above.

**Era note on `get_code` / `get_image`:** neither appears anywhere on the current tools-and-prompts
page — confirmed by direct query. A Figma community forum thread ("get design context does not
work — local/remote mcp server") states that **Figma renamed `get_code` to `get_design_context`**.
`get_image` is not corroborated anywhere in this research pass as a literal former tool name — it may
be shorthand some users use for `get_screenshot`/`download_assets` rather than a real prior tool.
Treat `get_code` as a confirmed **wrong-era name** for `get_design_context`, and `get_image` as
**unconfirmed**, not as a verified former name. `get_code_connect_map` is current and real, as the
task brief named it. `[V]` for the rename, `[G]` for whether `get_image` ever existed.

### 1.3 Plan/seat — cross-reference only, sibling file owns depth

Per help.figma.com "Guide to the Figma MCP server": **remote server — "available on all seats and
plans."** **Desktop server — "a Dev or Full seat" and "requires all paid plans,"** with a note that the
desktop variant is "primarily for specific use cases for organizations and enterprises." `[V]` See
`figma-plans-and-entitlement.md` for the full entitlement analysis; do not treat this table as the
authoritative account.

### 1.4 Wiring into Claude Code, VS Code, Cursor

**Claude Code**, remote server (docs-preferred path):

```
claude plugin install figma@claude-plugins-official
```
then `/plugin` → Installed → select `figma` → authenticate in the opened browser page. `[V]`,
help.figma.com "Claude Code and Figma: Set up the MCP server."

**Claude Code**, desktop server:

```
claude mcp add --transport http figma-desktop http://127.0.0.1:3845/mcp
```
Restart Claude Code afterward; confirm via `/mcp`. `[V]`, same source.

The `claude mcp add --transport http ...` command above is the verified answer for Claude Code; the
exact `.mcp.json` key shape it writes was not independently confirmed in this pass and is deliberately
not sketched here — a wrong key (e.g. omitting a `"type": "http"` field, which the VS Code flow below
does confirm is present in its own `mcp.json`) is exactly the failure mode this directory's own
`out-of-scope-claims.md` already documents once. `[G]`

**VS Code**: Command Palette → "MCP: Add Server" → HTTP transport → paste URL → name it. Writes into
VS Code's own `mcp.json`. `[V]` (from local-server-installation doc).

**Cursor**: Settings → Cursor Settings → MCP tab → "Add new global MCP server" → paste config. `[V]`
(same doc).

None of the three official flows differ in principle between remote and local beyond the URL/auth —
remote goes through Figma's OAuth-style plugin auth; local is a bare unauthenticated localhost URL,
implicitly trusting "whatever is running Figma desktop and can reach 127.0.0.1:3845." `[I]`

### 1.5 WSL2 specifically — the load-bearing question for this environment

**This is the answer Bilgehan needs and it is not fully settled by primary sources.**

**Gated by entitlement first:** §1.3 states the desktop server needs a Dev or Full seat on a paid
plan; the remote server is open to all seats and plans.

**The sibling file has since answered the plan half and left the seat half open.** Professional is a
paid plan, so the plan gate is clear `[V]`. The **seat** gate is not: the entitlement file assumes a
Full seat without confirming it, and that assumption is now a named gap at global rank 2
([`figma-plans-and-entitlement.md`](figma-plans-and-entitlement.md), Answer). `[I]` If the seat turns
out to be Collab or View, everything below is **moot** — the remote server has no localhost
dependency and becomes the only path regardless of networking config. **Confirm the seat before
spending time on the empirical test at the end of this section**; it is thirty seconds against a
multi-hour WSL debugging session.

The core problem, confirmed independently by multiple secondary sources (forum threads, a gist, a blog
post) and consistent with how WSL2 NAT networking works: **`127.0.0.1` inside WSL2's default NAT mode
resolves to the Linux VM's own loopback, not Windows' loopback**, so Claude Code / an editor running
inside WSL2 cannot reach a server Figma desktop binds to `127.0.0.1:3845` on the Windows side without
some bridge. `[W]` — consistent across sources, not from a Figma primary source, but the underlying
mechanism (WSL2 NAT vs mirrored networking) is well-established general WSL2 behavior, not
Figma-specific speculation.

Reported fixes, in the order sources present them:

1. **`networkingMode=mirrored` in `.wslconfig`, then `wsl --shutdown`.** Multiple forum posters report
   this makes `127.0.0.1:3845` reachable from inside WSL2 without further steps, because mirrored mode
   makes WSL2 share the host's network interfaces/loopback instead of NATing through a virtual one.
   `[W]`
2. **`netsh interface portproxy`** from Windows, forwarding the WSL2 VM's IP to `127.0.0.1:3845` on
   Windows, plus a firewall rule — used as an alternative when mirrored mode isn't in play, or in
   addition to it. `[W]`
3. **SSH tunnel** WSL→Windows as a third option, less commonly recommended. `[W]`

**Bilgehan already runs `networkingMode=mirrored`.** Per the mechanism reported above, this should make
`http://127.0.0.1:3845/mcp` (or the remote server, moot point) directly reachable from WSL2 without a
port-proxy workaround — i.e. the desktop MCP server case should already resolve for him. `[W→I]`, not
independently tested.

**The unresolved caveat, and the one worth flagging loudly:** one forum poster in the same thread
reported that **enabling mirrored networking mode "completely breaks the WSL↔VS Code connections"** —
i.e. it may fix Figma-desktop reachability while breaking the `code .` / Remote-WSL editor connection
that a VS Code (or VS Code–based) workflow depends on. This is a single-source report, not corroborated
elsewhere in this research pass, and not from Figma or Microsoft. `[W]`, flagged as the single most
important unverified claim in this file.

**What would settle it:** empirical test on Bilgehan's own machine — with `networkingMode=mirrored`
already active, (a) confirm `curl http://127.0.0.1:3845/mcp` succeeds from inside WSL2 while Figma
desktop is running on Windows with Dev Mode MCP enabled, and (b) confirm the VS Code Remote-WSL
connection and Claude Code inside WSL2 are simultaneously unaffected. Neither Microsoft's WSL docs nor
Figma's docs were found to state this interaction explicitly — it is a WSL2 mirrored-networking
side effect, not a Figma-specific limitation, so Microsoft's WSL networking docs (not fetched in this
pass) are the better primary source to check next. `[G]`

**Practical fallback if mirrored mode does conflict:** use the **remote MCP server**
(`https://mcp.figma.com/mcp`) instead of the desktop one — it needs no localhost bridge at all, since
it is Figma-hosted, not desktop-app-hosted, and per §1.3 is available on "all seats and plans." This
sidesteps the WSL2 loopback problem entirely at the cost of the desktop-only tools (selection-based
prompting on `get_design_context`). `[V+I]`

---

## 2. Figma for VS Code extension

- **Publisher:** Figma. **Current version at time of check:** 0.4.5. **Marketplace page's stated
  update date:** 2026-06-28. `[V]`, VS Code Marketplace listing
  (`marketplace.visualstudio.com/items?itemName=Figma.figma-vscode-extension`).
- **What it does:** inspect designs inline, receive comment notifications, get Dev Mode code
  suggestions, link code to design components (Code Connect surface), run Dev Mode plugins — all
  inside the editor pane. `[V]`, same listing.
- **Seat requirement:** the listing states it needs "a full Design, Education, or Dev Mode seat in
  Figma." `[V]` — cross-reference against the sibling entitlement file.
- **What it does not do:** it is a design-inspection/commenting/Code-Connect-linking surface, not the
  MCP server and not a code generator on its own — code generation is the MCP server's job (§1), this
  extension's "code suggestions" surface is the same Dev Mode inspect-panel codegen, routed into the
  editor. `[I]`, inferred from the feature list; not explicitly contrasted against the MCP server in
  the listing text itself.
- **WSL Remote window support:** **not stated either way** in the Marketplace listing text retrieved.
  `[G]`. Many VS Code extensions that only need editor-side UI (not a language server needing the
  remote filesystem) function fine in a Remote-WSL window automatically, but this is a general VS
  Code extension-host inference, not a verified fact about this specific extension. `[I]`

---

## 3. Code Connect

### 3.1 What it solves

Code Connect links a Figma component to the actual production code for that component, so Dev Mode
shows real, versioned code snippets instead of Figma's auto-generated approximation. It is explicitly
a **mapping/documentation layer**, not a code executor: "Code Connect files are not executed... the CLI
essentially treats code snippets as strings." `[V]`, developers.figma.com/docs/code-connect and
`/docs/code-connect/html`.

### 3.2 Supported targets

Officially: **React and React Native, HTML** (an umbrella covering Web Components, Angular, and Vue —
i.e. anything with a component/custom-element abstraction that the HTML parser can target), **SwiftUI,
Jetpack Compose**, plus generic "template files" for other cases. `[V]`, `/docs/code-connect` overview
page.

### 3.3 Astro / plain HTML / web components — the direct answer

**No usable path for a framework-less, component-less static site.** Per Figma's own HTML target docs:
mapping files are TS/JS (`.figma.ts`/`.figma.js`), import `@figma/code-connect/html`, and use
`figma.connect()` to bind Figma node properties to **actual components** — Web Components, Angular
components, Vue components, Lit elements are named explicitly. The docs state plainly that Code
Connect **requires actual components, not plain static markup**, and that a framework-less hand-authored
HTML/CSS site without components "would not work meaningfully" with it. `[V]`

**For ulus-web:** Astro 7 static output, hand-written CSS, no framework, no Tailwind, no component
library (per this repo's `CLAUDE.md`) is not the shape Code Connect targets. Astro *components*
(`.astro` files) are not one of the named HTML-parser targets (Web Components/Angular/Vue), and nothing
in the fetched docs mentions Astro. **Conclusion: Code Connect is not usable here as designed.** `[V+I]`
An unverified stretch — treating each `.astro` file as a "web component" via some manual/template-file
mapping — is theoretically conceivable given the "template files, framework-agnostic" fallback
mentioned in the overview, but nothing found in this research confirms Astro compatibility, and this
should not be assumed workable without a dedicated spike. `[G]`

### 3.4 CLI, config, publish, plan gating

- **Plan/seat:** "Available on a Dev or Full seat on the Organization, and Enterprise plans." `[V]`,
  `/docs/code-connect` overview — i.e. gated well above what a Pro-plan individual account has; see
  sibling entitlement file for depth.
- **CLI:** referred to throughout as "the Code Connect CLI"; package is published as
  `@figma/code-connect` on npm. `[V]` (npm listing found via search, title only — package existence
  confirmed, contents of its README not fetched in this pass) `[G]` for exact command syntax beyond
  what's below.
- **Config file:** docs reference a "Configuring your project" / config-file page
  (`/docs/code-connect/api/config-file/`) whose exact filename/schema was **not fetched** in this pass.
  `[G]`
- **Publish step and exact CLI verbs** (`connect publish`, etc.) were **not confirmed** against a
  primary page in this research pass — the overview page did not state them and a dedicated
  `api/config-file` or CLI-reference page was not fetched. `[G]`

Moot for this repo regardless, per §3.3 and the plan gating above — Ulus is not on an Organization/
Enterprise plan for this per the entitlement research, and the target shape doesn't fit Astro anyway.

---

## 4. Default codegen output and hand-authored CSS

**All claims in this section are `[W]`** — sourced from a Figma community forum post
(forum.figma.com "Figma MCP with Code Connect doesn't return the right framework in get_design_context")
and secondary blog/wiki summaries, not from a Figma primary-source page found in this pass. Flagged for
promotion before being depended on.

- `get_design_context` **defaults to React + JSX + Tailwind** output. Prompting for a different
  framework/language, or passing `clientFrameworks`/`clientLanguages`-style hints, reportedly does
  **not** change the underlying generated markup — the tool still emits React+Tailwind and the calling
  agent is expected to translate it. `[W]`
- **Frames without auto-layout produce absolutely-positioned output**; frames using Figma auto-layout
  translate to flexbox/grid-shaped code. This is consistent with how Figma's auto-layout model maps
  conceptually to CSS layout models, which is unsurprising. `[W/I]`
- A secondary source describes a `create_design_system_rules`-style constraint mechanism that lets an
  agent post-process the default React+Tailwind output against a team's real token/styling system
  before finalizing code. **This tool name does not appear on the primary tools-and-prompts page
  fetched in §1.2** — it may be a skill/prompt convention layered on top by third-party guides rather
  than an MCP tool, or it may be newer than what was indexed. Treat as unconfirmed. `[G]`

**How this survives contact with ulus-web's hand-authored CSS:** on the `[W]`-grade evidence above, raw
MCP codegen output (React+Tailwind, possibly absolute-positioned) would need full manual
re-authoring into Astro components and the existing hand-written CSS design system regardless — there
is no configuration flag confirmed to make it emit plain semantic HTML/CSS directly. The realistic use
of the MCP server for this repo, on current evidence, is **`get_variable_defs`, `get_metadata`,
`get_screenshot`/`download_assets`, and `search_design_system` as design-inspection and token-extraction
tools** feeding a human-authored implementation — not `get_design_context` as a codegen shortcut.
`[I]`, drawn from the verified tool list (§1.2) plus the `[W]`-grade default-output behavior above.

---

## 5. Third-party Figma MCP servers

**GLips/Figma-Context-MCP ("Framelink")** — `[V]` for the repo-level facts below, fetched directly from
`github.com/GLips/Figma-Context-MCP`:

- Purpose: talks to the Figma REST API and simplifies/filters the response to "the most relevant
  layout and styling information" before handing it to a coding agent (e.g. Cursor), aiming for more
  accurate one-shot implementations than raw API output.
- **Requires a Figma personal access token (PAT)** — user-generated, not OAuth, configured directly in
  the MCP server's own settings/client config.
- Runs as a **local process** via `npx figma-developer-mcp`, not a hosted remote endpoint — talks
  outbound to Figma's REST API using the PAT, so no localhost-bridging problem like §1.5 (it doesn't
  depend on Figma desktop being open at all — it hits `api.figma.com` directly).
- Trust/maintenance profile at time of check: 15.5k GitHub stars, 1.2k forks, MIT license, 260 commits
  on `main`, 60 watchers, 15 open PRs / 7 open issues — indicates active, well-adopted project, but
  **exact last-commit date was not visible in the fetched content** `[G]`.
- Trust implication worth naming explicitly: a PAT-based third-party server is a **standing credential
  handed to a third-party process** with whatever scope the PAT carries — categorically different risk
  from the official desktop server (no credential, localhost-only, requires the desktop app open and
  the file open) or the official remote server (Figma-hosted OAuth flow). `[I]`

No other third-party server was independently verified in this pass; the task brief names GLips/
framelink specifically and that is the one checked.

---

## Open for research

- [ ] **Empirical WSL2 mirrored-mode test** — confirm on Bilgehan's actual machine whether
      `networkingMode=mirrored` makes `http://127.0.0.1:3845/mcp` reachable from WSL2 *and* whether it
      breaks the VS Code Remote-WSL connection simultaneously, as one forum poster reported. This is
      the single highest-value unresolved item in this file. `[W]` → needs `[V]` or a documented `[G]`
      with a workaround chosen.
- [ ] **Microsoft's own WSL2 mirrored-networking docs** — not fetched in this pass; likely the better
      primary source for the loopback-sharing mechanism than Figma/community forum posts.
- [ ] **`@figma/code-connect` CLI reference and config-file schema** — publish command, config
      filename, exact schema; not fetched. Moot for this repo per §3.3/§3.4 conclusion, but would
      matter if a future component-based sub-project used Code Connect.
- [ ] **`get_design_context` output-framework claim** — currently `[W]`, sourced from a forum post, not
      Figma docs. Worth confirming directly against `/docs/figma-mcp-server/tools-and-prompts/` or a
      dedicated best-practices page (the `guides/best-practices` URL 404'd in this pass — find the
      correct current path).
- [ ] **`create_design_system_rules`-style constraint tool** — not found on the primary tool list
      fetched; confirm whether it exists as an MCP tool, a CLI/skill convention, or is stale/renamed.
- [ ] **Figma for VS Code extension in a Remote-WSL window** — no primary statement found either way;
      untested.
- [ ] **Framelink last-commit date and any security review** — stars/forks confirmed, recency not.

---

## Sources

**Primary:**
- [Guide to the Figma MCP server](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server) — help.figma.com
- [Set up the desktop server](https://developers.figma.com/docs/figma-mcp-server/local-server-installation/) — developers.figma.com
- [Tools and prompts](https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/) — developers.figma.com
- [Claude Code and Figma: Set up the MCP server](https://help.figma.com/hc/en-us/articles/39888612464151-Claude-Code-and-Figma-Set-up-the-MCP-server) — help.figma.com
- [Code Connect overview](https://developers.figma.com/docs/code-connect) — developers.figma.com
- [Code Connect — HTML](https://developers.figma.com/docs/code-connect/html) — developers.figma.com
- [Figma for VS Code — Marketplace listing](https://marketplace.visualstudio.com/items?itemName=Figma.figma-vscode-extension) — Microsoft Marketplace
- [GLips/Figma-Context-MCP](https://github.com/GLips/Figma-Context-MCP) — GitHub, publisher's own README

**Secondary (marked `[W]` inline, not independently confirmed):**
- [Figma forum: mcp server, claude code and wsl](https://forum.figma.com/report-a-problem-6/mcp-server-claude-code-and-wsl-42517)
- [Setup Figma MCP (Windows | WSL2) — gist by QuentinFrc](https://gist.github.com/QuentinFrc/1f07d3e7f4d867f85b86994e270f6608)
- [Figma forum: Figma MCP with Code Connect doesn't return the right framework in get_design_context](https://forum.figma.com/report-a-problem-6/figma-mcp-with-code-connect-doesn-t-return-the-right-framework-in-get-design-context-53081)
- [`@figma/code-connect` on npm](https://www.npmjs.com/package/@figma/code-connect) (existence only, contents not fetched)
