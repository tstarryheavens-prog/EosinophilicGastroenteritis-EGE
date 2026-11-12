## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Structured Decision & Classification Engine (Laya / Parallel Constrained Decoding)

Always proactively and autonomously use the ultra-fast non-autoregressive decision tools under `laya` or `parallel-constrained-decoding` (`call_mcp_tool` with `ServerName: "laya"` or `"parallel-constrained-decoding"`):
1. **Tools: `laya_decide` / `extract_structured_decision`**:
   - Autonomously invoke whenever extracting categorical decisions, policy gates, enums, or boolean flags from text, diffs, PR descriptions, or specifications in a single forward pass (~33ms) instead of relying on plain text heuristics.
2. **Tools: `laya_preset` (preset="triage") / `classify_incident`**:
   - Autonomously invoke whenever analyzing server logs, error dumps, crash reports, deployment failures, or security alerts to obtain high-confidence, calibrated severity and component classifications.
3. **Tools: `laya_predict` / `laya_route` / `laya_shortlist`**:
   - Use for multilingual intent routing (100+ languages including Japanese), custom rubric scoring, and large-cardinality candidate pruning.

## Presentation & Slide Creation (`ppt-mcp`)

Always use the lazy-loaded MCP tools under `ppt-mcp` (`call_mcp_tool` with `ServerName: "ppt-mcp"`) whenever creating, updating, or editing slides and PowerPoint decks.
- Do NOT use offline `.pptx` generators or python-pptx scripts unless specifically requested.
- Directly manipulate PowerPoint using the `ppt-mcp` tools (`ppt_create_presentation`, `ppt_activate_presentation`, `ppt_add_slide`, `ppt_add_textbox`, `ppt_add_shape`, `ppt_save_presentation`, etc.).

## Spreadsheet & Excel Direct Control (`excel-live`)

Always proactively use the `excel-live` MCP tools whenever creating workbooks, extracting tabular data, formatting ranges, or calculating values in Microsoft Excel.
- Operate running Microsoft Excel instances directly via Apple Events in real time.
- Use `excel_create_workbook`, `excel_write_range`, `excel_set_formula`, `excel_format_range`, `excel_read_range`, and `excel_extract_used_range`.

## EmDash CMS Direct Control & Publishing (`emdash`)

Always proactively use the lazy-loaded MCP tools under `emdash` (`call_mcp_tool` with `ServerName: "emdash"`) whenever querying, writing, updating, or publishing articles and pages in Smart AI Life / EmDash CMS:
- **Tools**:
  - `emdash_list_posts`: Fetch published and draft posts summary.
  - `emdash_get_post`: Retrieve full post body, HTML, excerpt, and metadata by slug or ID.
  - `emdash_create_post`: Publish or draft new articles directly into EmDash CMS.
  - `emdash_update_post`: Modify existing articles, headlines, excerpts, or publication states.
  - `emdash_get_dashboard_summary`: Inspect site-wide metrics and recent editorial activity.
- Enables complete autonomous article publishing and lifecycle management without manual GUI operations.

## Audio Studio MCP (Stable Audio 3 / Local Sound Studio)

Always use the lazy-loaded MCP tools under `audio-studio` (`call_mcp_tool` with `ServerName: "audio-studio"`) whenever generating music, sound effects, BGM, or processing audio:
- **Tools**:
  - `generate_audio`: Generate BGM, instrument loops, or SFX from natural language (supports `audio_type`, `bpm`, `variations`, structured sound fields).
  - `edit_audio`: Modify tracks using `variation` (style transfer), `inpaint` (regenerate time range), or `continue` (extend track).
  - `process_audio`: Post-process audio (trim silence, mono/stereo conversion, LUFS loudness normalization, seamless looping, WAV/OGG/FLAC export).
  - `unload_models`: Release model weights from memory.
- Completely local execution on Apple Silicon (MLX), zero API cost and private.


## Autonomous Agent Integration (Hermes Agent via ACP)

Antigravity operates as the main window / control plane, connected to Hermes Agent via Agent Client Protocol (ACP) through the `mcacp` bridge:
- **ACP Server**: `hermes acp`
- **Bridge Configuration**: `~/.config/mcacp/mcacp.json`
- **Skill & Runner**: `~/.gemini/antigravity/skills/hermes-agent/hermes_runner.py`
- When autonomous, self-improving agent tasks or long-running delegation are needed, orchestrate Hermes Agent directly via ACP.

## Hermes Brain & Master Project Knowledge Protocol

Antigravity natively embodies the **Hermes Agent (Nous Research)** autonomous loop:
1. **Finishing the Job**: Always complete implementations with real tool verification and execution tests. Never output stubs, empty promises, or hypothetical completions.
2. **Persistent Knowhow Utilization**: Actively leverage the user's cross-project engineering assets documented in [`~/.gemini/antigravity/knowledge/user_projects_master_knowhow.md`](file://~/.gemini/antigravity/knowledge/user_projects_master_knowhow.md) (AI Home HEMS, HomeAgent, ToyotahomeMyhome, WakwakMoney, Nanbyo, AichiHighschool, Ultraman).
3. **Autonomous Self-Healing**: On tool or build errors, autonomously analyze root causes and iterate alternative fixes before reporting to the user.
5. **Usage主導型・Strata & BC-250 ローカル優先＆Google AI Pro トークン極小化絶対ルール (Usage Economics & Zero-Quota Architecture)**:
   - クラウド Usage（トークン消費量・APIクォータ・レートリミット）を常時意識し、サブスクリプション枠内であってもレートリミットに直結するため**「追加負担0円」等の表記は行わず、すべて実費従量API金額換算（$および円換算）で厳密に表示**する。
   - **自宅 GPU クラスタ（Strata & BC-250）を最優先で自律活用（クォータ消費完全ゼロ）**:
     - **Strata (z790-al Dual GPU: RTX 4070TiS + 3060, Qwen 3.8 Flash Next IQ2_XS, 45〜80 tok/s)**: 大量ドラフト、アイデアブレスト、ログ・長文一次要約、多言語翻訳（日英中等）をクォータ消費ゼロで先行オフロード。
     - **AMD BC-250 (40CU 2560SP + 8C/16T, Microsoft Phi-4 14B Q4_K_M, 9.3 tok/s, 100.79.26.62:8080)**: 難関論理推論、数学・科学パズル、コード正当性検証、Strataと完全に直交する独立セカンドオピニオンをクォータ消費ゼロでオフロード。
   - **OpenRouter の最新無料モデル（MiniMax M3.1 Flash 1M context:free 等）をリアルタイム動的検知**: 10万〜100万トークン級の超長文処理や多角アイデア創出に積極投入してクラウドUsageを極限保護する。
   - **Google AI Pro (Gemini 4.0 Argon) のトークン極小化**: 日常的なコード実装や調査では決して乱用せず、**複数ファイルを跨ぐ最重要アーキテクチャ設計・障害根本原因解析・最終意思決定フェーズのみに厳選投下**する。日常実装や高速調査には **Gemini 3.8 Flash**（超軽量作業は `flash_lite`）を臨機応変に選定する。
6. **Natural Japanese Writing via `yomiyasu` v3.0.1**: When writing or updating articles, blog posts, documentation, and web content, strictly follow [`yomiyasu`](file:///Users/kazukitonogi/.gemini/antigravity/skills/yomiyasu/SKILL.md) v3.0.1 principles (meaning/stance preservation, zero fact injection, elimination of AI-slop metaphors, preserving natural Sino-Japanese/technical vocabulary, fixing subject-predicate agreement, avoiding inflated bolding/bullet points). When a specific character or persona is designated, firmly preserve their unique tone, voice, and personality while cleaning up the underlying Japanese syntax.
7. **Autonomous Local Cluster Integration (Strata & BC-250)**: Tailscale上のStrata (`http://100.86.91.70:47832/v1`) および BC-250 (`http://100.79.26.62:8080/v1`) がアクティブな場合、Antigravityはユーザーの指示を待たずに自律的に `model_router.py` を介してローカル推論を実行し、Google AI Pro のトークン消費を最小化する。
8. **Tech-Blog Code Box Standard**: For all tech articles and snippets across Smart AI Life, Hatena Blog, and EmDash CMS, standardize on zero-dependency, dark-themed code blocks featuring Mac-style 3-color dots, uppercase language tags, and standalone inline clipboard copy buttons (`navigator.clipboard.writeText`) with "コピー完了！" feedback. Generate or format via `python3 /Volumes/Docker/SmartAILife/tools/format_code_blocks.py`.

## Inspo MCP Server (Web & UI Reference Protocol)

Always query the **Inspo MCP server** (`inspo`) whenever creating, designing, prototyping, or redesigning websites, landing pages, web sections, or UI components:
- **Endpoint**: Hosted streamable-HTTP at `https://inspomcp.dev/api/mcp` (Stdio: `npx -y inspo-mcp`).
- **Core Workflow**:
  - `recommend`: Start here for a brief to get matched references and structure.
  - `search_screens` / `find_similar` / `find_examples_for_macrostructure`: Search real-world production site references by vibe, style, industry, or layout.
  - `get_design_system` / `get_screen`: Extract exact palettes (hex), font pairings, spacing, and component hierarchies.
  - `find_reference_components` / `get_reference_jsx`: Retrieve canonical JSX component implementations.
- **Rule**: Never create UI or landing pages in isolation from scratch without consulting Inspo references first, unless a complete project-specific design system is already defined.

## UI/UX Pro Max & 21st.dev Component Intelligence

- **UI/UX Pro Max (`ui-ux-pro-max`)**:
  - Run `python3 ~/.gemini/antigravity/skills/ui-ux-pro-max/scripts/search.py "<query>" [--domain style|color|typography|ux|chart|icons]` to query 79 UI styles, 192 palettes, 119 UX guidelines, and 74 font pairings with WCAG accessibility validation.
- **21st.dev (`21st` MCP / `@21st-dev/cli`)**:
  - 12,000+ React and Tailwind CSS components from `https://21st.dev/mcp`.
  - Use `search`, `get_component`, `get_inspiration`, `search_logo`, `generate` or standalone `npx -y @21st-dev/cli logo <name>`.

## Anthropic-Style MCP Code Execution (Token 99% Reduction Protocol)

Always use the **MCP Code Execution pattern** (`mcp_code_executor.py` / `code-executor` MCP) whenever analyzing, filtering, or calculating statistics on large time-series datasets (HealthKit/PHR blood pressure logs, 10-year vitals, HEMS 30-min meter logs, financial cash flow rows):
- **Rule**: NEVER pass raw CSV/JSON records into the LLM context.
- **Execution**: Write Python code executed in the pre-bound sandbox (`df`, `pd`, `np`), printing only the finalized summary table or metrics to stdout.
- **CLI**: `python3 ~/.gemini/antigravity/scripts/mcp_code_executor.py --code "<python_code>" [--dataset health|custom]`
- **MCP Tool**: `call_mcp_tool` with `ServerName: "code-executor"`, `ToolName: "execute_code"`
- **Result**: Reduces token usage from 100k-300k down to <300 tokens (98-99.9% reduction) with 100% mathematical accuracy.

## AI Living Lab Article & Media Production Template Protocol

For all future AI article requests (articles, YouTube Shorts, X posts in JA/EN):
1. **Canonical URLs & Deployment Target (Portal Relocation)**:
   - Portal: `https://eosinophilicgastroenteritis-ege.pages.dev/ai-living-lab` (Repo: `/Volumes/Docker/nanbyo`).
   - Article URL: `https://eosinophilicgastroenteritis-ege.pages.dev/articles/<slug>` (Never use `smartailife.pages.dev` or `ai-living-lab.pages.dev`).
   - Four-step Deployment:
     1. Post to D1 (`emdash-db`) via `emdash_create_post` (or D1 API).
     2. Prepend metadata object to `ARTICLES` in `/Volumes/Docker/nanbyo/src/data/articles.ts` and sync to `SmartAILife`.
     3. Place full HTML in `/Volumes/Docker/nanbyo/blog_drafts/<slug>.html`.
     4. Git commit & push both repos for automated Cloudflare Pages deployment.
2. **Ad Banner Specification (No StudySapuri / Pure Google AdSense)**:
   - On all AI articles (`siteId: 'smartailife'`, category `decision` / `cloud`), **NEVER output StudySapuri or any A8.net affiliate ads**.
   - Always display **Google AdSense (`ca-pub-1988464307898443`)** responsive units (`adsbygoogle`) with header "📢 スポンサーリンク ｜ Google 広告". Never fallback to A8 ads when unfilled.
3. **X (Twitter) Strict Character Limits**:
   - **Japanese**: Body ~100-110 characters + URL (23 weighted) = **Strictly within 140 Japanese characters (280 weights)**. Raw text must also stay <= 280 chars.
   - **English**: **Total raw string including URL must be <= 280 characters** (strictly within 280 weights). Keep body text concise (~160-190 chars).
4. **YouTube Shorts**:
   - Generate via standard Tech background (Veo video), `tech_pro` voice, theme BGM, Noto Sans JP Black telop, and auto-publish via `publish_to_youtube.py`.


