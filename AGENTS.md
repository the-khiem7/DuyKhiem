# AGENTS.md

## Mission
This file is the **single playbook** for AI agents operating in this repository — covering blog authoring, project editing, theming, configuration, and all common VSCode-based tasks.

If this playbook and source schema are followed, agents do **not** need to read `src/content/docs` for normal work.

---

## Scope
Applies to:
- New posts in `src/content/blog`
- Updates to existing blog posts (`.md` and `.mdx`)
- Project entries in `src/content/projects`
- Site configuration and theming changes
- Component customization and page editing
- General codebase navigation and editing in VSCode

Does not apply to:
- Theme core development in `packages/pure` (unless explicitly requested)
- Content schema changes in `src/content.config.ts` (unless explicitly requested)

---

## Source of Truth
When conflicts happen, trust in this order:
1. `src/content.config.ts` (schema definitions)
2. Actual component source under `packages/pure/components/**` or `node_modules/astro-theme-pure/`
3. This `AGENTS.md`
4. `src/site.config.ts` (runtime config)

---

## 1. Project Identity

| Key | Value |
|---|---|
| Framework | Astro 5.x with `astro-theme-pure` (NPM package mode, v4.0+) |
| Package manager | Bun (primary), pnpm/npm compatible |
| Styling | UnoCSS + CSS variables |
| Content format | Markdown (`.md`) and MDX (`.mdx`) via Astro Content Collections |
| Deployment | Vercel (default); supports Node, Bun, Static, GitHub Pages |
| Owner | Nguyen Van Duy Khiem — backend-first engineer |

---

## 2. Directory Map

```
.
├── AGENTS.md                  # This playbook
├── astro.config.ts            # Astro framework config (integrations, Vite, etc.)
├── package.json               # Dependencies and scripts
├── eslint.config.mjs          # ESLint flat config
├── prettier.config.mjs        # Prettier config
├── docs/                      # Project planning docs (not published)
├── packages/pure/             # Theme package (local workspace)
│   ├── scripts/               # CLI helpers (new.mjs for post creation)
│   ├── schemas/               # Zod sub-schemas (logo, share, social)
│   ├── types/                 # TypeScript types for config
│   └── utils/                 # Shared utilities
├── preset/                    # Custom icons and preset components
├── public/                    # Static assets (favicon, CV, images, icons)
├── src/
│   ├── content.config.ts      # Content collection schemas (SINGLE SOURCE OF TRUTH)
│   ├── site.config.ts         # Theme + integration config (title, nav, footer, etc.)
│   ├── assets/                # Processed assets (images, styles, icons)
│   │   └── styles/
│   │       ├── app.css        # CSS variables and theme tokens
│   │       └── global.css     # Global style overrides
│   ├── components/            # Swizzled/custom Astro components
│   │   ├── BaseHead.astro
│   │   ├── about/
│   │   ├── home/
│   │   ├── links/
│   │   ├── projects/
│   │   └── waline/            # Comment system components
│   ├── content/
│   │   ├── blog/              # Blog posts (folder-per-post pattern)
│   │   ├── docs/              # Theme documentation
│   │   └── projects/          # Project showcase entries
│   ├── pages/                 # File-based routing
│   │   ├── index.astro        # Homepage
│   │   ├── 404.astro
│   │   ├── robots.txt.ts
│   │   ├── rss.xml.ts
│   │   ├── projects/
│   │   ├── search/
│   │   ├── tags/
│   │   └── terms/             # Legal pages (md)
│   └── plugins/               # Rehype/Shiki custom plugins
└── uno.config.ts              # UnoCSS configuration
```

---

## 3. Content Collections (src/content.config.ts)

Three collections exist, all using Astro's `glob` loader:

### 3.1 Blog Collection
- **Path pattern**: `src/content/blog/**/*.{md,mdx}`
- **Schema** — see [Blog Frontmatter Contract](#blog-frontmatter-contract-strict) below for full details.

### 3.2 Docs Collection
- **Path pattern**: `src/content/docs/**/*.{md,mdx}`
- **Schema fields**: `title`, `description`, `publishDate`, `updatedDate`, `tags`, `draft`, `order` (default 999)

### 3.3 Projects Collection
- **Path pattern**: `src/content/projects/**/*.{md,mdx}`
- **Schema fields**: `title`, `description`, `publishDate`, `updatedDate`, `tags`, `draft`, `order` (default 999), `category` (`flagship` | `supporting`), `role`, `duration`, `stack` (string[]), `links` (array of `{text, href, icon?}`)

---

## 4. Site Configuration (src/site.config.ts)

This file exports `config` (typed as `Config`) containing:

### Theme settings
- `title`: "Nguyen Van Duy Khiem"
- `author`: "Duy Khiem"
- `description`: site meta description
- `locale`: `en-US`
- `npmCDN`: `jsdelivr`

### Navigation (header.nav)
Blog, Docs, Projects, Links, About

### Footer
GitHub (`the-khiem7`), LinkedIn links

### Content settings
- `blogPageSize`: 8
- `externalLinkArrow`: true
- Share options: Twitter, Mastodon, Facebook, Pinterest, Reddit, Telegram, Email

### Integrations (`integ`)
- **Links**: logbook and applyTip configs
- **Pagefind**: search enabled
- **Quote**: external API (dummyjson)
- **Typography**: UnoCSS preset
- **MediumZoom**: image zoom
- **Waline**: comment system with serverURL

---

## 5. Key Configuration Files

| File | Purpose | When to edit |
|---|---|---|
| `astro.config.ts` | Astro integrations, Vite config, build settings | Adding integrations, changing build behavior |
| `src/site.config.ts` | Theme config, nav, footer, integrations | Changing site metadata, navigation, features |
| `src/content.config.ts` | Content collection schemas | Adding/modifying collection fields (rare) |
| `uno.config.ts` | UnoCSS presets and rules | Adding utility classes or custom rules |
| `src/assets/styles/app.css` | CSS variables and theme tokens | Changing colors, fonts, spacing tokens |
| `src/assets/styles/global.css` | Global style overrides | Adding site-wide CSS |
| `eslint.config.mjs` | Linting rules | Adjusting code quality rules |
| `prettier.config.mjs` | Formatting rules | Adjusting formatting preferences |

---

## 6. Blog Authoring

### Required Folder Layout
Each post lives in its own folder, with **language-based filenames**:

```
src/content/blog/<slug>/
├── en.mdx          (English version — default)
├── vi.mdx          (Vietnamese version — optional)
├── thumbnail.jpg   (shared hero image)
└── diagram.png     (other shared assets)
```

- **English content** → `en.mdx` (or `en.md`), with `language: 'English'` in frontmatter
- **Vietnamese content** → `vi.mdx` (or `vi.md`), with `language: 'Vietnamese'` in frontmatter
- Both versions share the same folder and assets (e.g. `thumbnail.jpg`)
- If only one language exists, still use `en.mdx` or `vi.mdx` (not `index.mdx`)

Generated URLs:
- `/blog/<slug>/en` (English)
- `/blog/<slug>/vi` (Vietnamese)

Slug rules:
- use lowercase kebab-case
- keep it short and semantic
- avoid dates in slug unless explicitly requested

### Quick creation
```bash
bun pure new <post-slug>
```

### Blog Frontmatter Contract (Strict)
From `src/content.config.ts` (`blog` collection):

Required:
- `title`: string, max 60 chars
- `description`: string, max 160 chars
- `publishDate`: valid date

Optional:
- `updatedDate`: valid date
- `heroImage` object:
  - `src` (required if `heroImage` exists)
  - `alt?`, `inferSize?`, `width?`, `height?`, `color?`
- `tags`: string[] (auto lowercased and deduplicated by schema transform)
- `language`: string
- `draft`: boolean, default `false`
- `comment`: boolean, default `true`

Recommended frontmatter template:

```yaml
---
title: 'Your Post Title'
description: 'One clear sentence under 160 chars.'
publishDate: '2026-03-05T08:00:00Z'
updatedDate: '2026-03-05T08:00:00Z'
tags:
  - astro
  - mdx
heroImage: { src: './thumbnail.jpg', alt: 'Short visual description', color: '#B4C6DA' }
language: 'English'
draft: false
comment: true
---
```

### Markdown and MDX Decision Rules
Use `.md` when:
- content is text-first
- no component UI is needed

Use `.mdx` when:
- you need Astro-style component tags (`<Aside>`, `<Tabs>`, etc.)
- you need richer interactive presentation blocks

Do not use MDX for plain prose.

### Markdown Features Available in This Repo
Configured in `astro.config.ts` and theme integration:
- math support (`remark-math`, `rehype-katex`)
- heading anchors/autolink
- shiki syntax highlighting
- code title and notation support
  - title: ` ```ts title="example.ts" `
  - add line: `// [!code ++]`
  - remove line: `// [!code --]`
  - highlight line: `// [!code highlight]`

### MDX Runtime Model (Important)
- In `.mdx`, import components at top-level and render with JSX-style tags.
- This is Astro MDX, so component syntax is similar to `.astro` usage.
- `slot='...'` is supported if that component exposes slots.
- Keep trees shallow; avoid deeply nested UI in normal blog posts.

### Minimal Blog Authoring Workflow
1. Pick slug and create `src/content/blog/<slug>/`.
2. Create `en.mdx` (English) and/or `vi.mdx` (Vietnamese).
3. Add assets (`thumbnail.jpg`, inline images).
4. Fill frontmatter per schema — set `language` field appropriately.
5. Write content using this playbook.
6. Run checklist and finalize.

---

## 7. Project Entry Conventions

### Folder structure
```
src/content/projects/<slug>/
└── index.md
```

### Frontmatter template
```yaml
---
title: 'Project Name'
description: 'Brief project description'
publishDate: '2025-01-01'
tags:
  - typescript
  - react
category: 'flagship'
role: 'Full Stack Developer'
duration: 'Jan 2025 - Present'
stack:
  - React
  - Node.js
  - PostgreSQL
links:
  - { text: 'GitHub', href: 'https://github.com/...', icon: 'github' }
  - { text: 'Live Demo', href: 'https://...' }
order: 1
---
```

---

## 8. Component System

### Supported Component Libraries
Primary imports:
- `astro-pure/user`
- `astro-pure/advanced`
- `astro-pure/libs` (rare, mostly `Icons`)

### `astro-pure/user` API Reference

| Component | Key Props | Slots | Notes |
|---|---|---|---|
| `Aside` | `type?: 'note'|'tip'|'caution'|'danger'`, `title?: string` | default | Invalid `type` throws error. |
| `Tabs` | `syncKey?: string` | default (contains `TabItem`) | Tab label sync can persist via localStorage when `syncKey` is set. |
| `TabItem` | `label: string` (required) | default | Missing `label` throws error. |
| `Collapse` | `title: string` (required), `class?` | `before`, default | Use for expandable sections. |
| `Card` | `as?`, `href?`, `heading?`, `subheading?`, `date?`, `imagePath?`, `altText?`, `imageClass?`, `class?` | default | `imagePath` resolves from `/src/assets/**`, not from post-local files. |
| `MdxRepl` | `width?: string` | default, `desc` | Mostly for demo/docs style, avoid overusing in blogs. |
| `CardList` | `title`, `list`, `collapse?`, `class?` | none | `list` shape: `{ title, link?, children? }[]`. |
| `Timeline` | `events: { date: string; content: string }[]`, `class?` | none | `content` is rendered as HTML string. |
| `Steps` | none | default | Must contain exactly one ordered list (`<ol>`). |
| `Button` | `as?`, `title?`, `href?`, `variant?: 'button'|'pill'|'back'|'ahead'`, `class?` | `before`, default, `after` | Good for CTA or navigation blocks. |
| `Spoiler` | `as?`, `class?` | default | Text reveal on hover. |
| `FormattedDate` | `date: Date`, `dateTimeOptions?`, `class?` | none | Pass `new Date(...)` in MDX. |
| `Label` | `as?`, `title` (required), `href?`, `class?` | `icon`, default | Simple label/link row. |
| `Svg` | `src: import('*.svg?raw')`, SVG attrs | none | Must use `?raw`; do not use `alt`. |
| `Icon` | `name` (from icon map), `label?`, `color?`, `size?`, `class?` | none | If `label` missing, icon is `aria-hidden`. |

### `astro-pure/advanced` API Reference

| Component | Key Props | Notes |
|---|---|---|
| `Quote` | `class?` | Fetches quote from `integ.quote` config. Needs network at runtime. |
| `GithubCard` | `repo` (e.g. `owner/repo` or full GitHub URL) | Fetches `api.github.com` client-side. |
| `LinkPreview` | `href` (required), `hideMedia?: boolean`, `zoomable?: boolean` | Fetches OpenGraph data; falls back to plain link if metadata missing. |
| `QRCode` | `content?`, `class?` | If `content` missing, uses current page URL. |
| `MediumZoom` | `selector?`, `background?` | Injects medium-zoom script for images. |

### `astro-pure/libs`
- `Icons` export exists.
- Use when you need to iterate icon names dynamically.
- Prefer `Icon` component directly for regular blog usage.

### Swizzling Pattern
To customize a theme component:
1. Copy from `node_modules/astro-theme-pure/components/` to `src/components/`
2. Fix import paths (change relative to package imports)
3. Update any references to point to your local copy

---

## 9. Known-Good MDX Snippets

### Aside
```mdx
import { Aside } from 'astro-pure/user'

<Aside type='tip' title='Quick tip'>
  Keep this section short and actionable.
</Aside>
```

### Tabs
```mdx
import { Tabs, TabItem } from 'astro-pure/user'

<Tabs syncKey='pkg-manager'>
  <TabItem label='bun'>bun dev</TabItem>
  <TabItem label='npm'>npm run dev</TabItem>
</Tabs>
```

### Collapse with `before` slot
```mdx
import { Collapse } from 'astro-pure/user'

<Collapse title='Show details'>
  <div slot='before' class='text-sm text-muted-foreground'>Optional lead-in</div>
  <p>Expanded content here.</p>
</Collapse>
```

### Steps (must be a single ordered list)
```mdx
import { Steps } from 'astro-pure/user'

<Steps>
1. First step
2. Second step
3. Third step
</Steps>
```

### Button variants
```mdx
import { Button } from 'astro-pure/user'

<Button as='a' href='/blog' title='Read more' variant='ahead' />
<Button as='div' title='Back' variant='back' />
```

### Link preview
```mdx
import { LinkPreview } from 'astro-pure/advanced'

<LinkPreview href='https://docs.astro.build/' hideMedia />
```

### QR code
```mdx
import { QRCode } from 'astro-pure/advanced'

<QRCode content='https://example.com' class='inline-flex max-w-44 p-3 border rounded-lg' />
```

---

## 10. Styling System

### UnoCSS
- Config in `uno.config.ts`
- Typography via `@unocss/preset-typography`
- Utility-first classes available in all `.astro`, `.mdx` files

### CSS Variables (src/assets/styles/app.css)
- Theme tokens for colors, spacing, typography
- Supports light/dark mode via CSS custom properties
- Override variables here for global theme changes

### Global Styles (src/assets/styles/global.css)
- Site-wide CSS overrides
- Applied after theme defaults

---

## 11. Routing and Pages

### File-based routing (`src/pages/`)
- `index.astro` → `/`
- `404.astro` → `/404`
- `projects/index.astro` → `/projects`
- `projects/[...id].astro` → `/projects/<id>` (dynamic)
- `tags/index.astro` → `/tags`
- `tags/[tag]/[...page].astro` → `/tags/<tag>/<page>` (paginated)
- `search/index.astro` → `/search`
- `terms/*.md` → `/terms/*`
- `robots.txt.ts` → `/robots.txt`
- `rss.xml.ts` → `/rss.xml`

### Content routes (auto-generated)
- Blog posts: `/blog/<slug>`
- Docs: `/docs/<path>`
- Projects: `/projects/<slug>`

---

## 12. Common Editing Tasks

### Adding a new blog post
1. Run `bun pure new my-post-slug` or create folder manually
2. Create `src/content/blog/my-post-slug/en.mdx` (English) and/or `vi.mdx` (Vietnamese)
3. Add frontmatter per schema — set `language: 'English'` or `language: 'Vietnamese'`
4. Place images in same folder (shared between languages)
5. Write content following the blog authoring rules in this file

### Adding a new project
1. Create `src/content/projects/my-project/index.md`
2. Fill frontmatter with all project schema fields
3. Write project description in body

### Modifying navigation
Edit `src/site.config.ts` → `theme.header.nav` array

### Changing site metadata
Edit `src/site.config.ts` → `theme.title`, `theme.description`, `theme.author`

### Adding a new page
Create `.astro` or `.md` file in `src/pages/`

### Customizing a theme component
1. Find source in `node_modules/astro-theme-pure/components/`
2. Copy to `src/components/`
3. Fix imports and references

### Modifying CSS variables
Edit `src/assets/styles/app.css`

### Adding global styles
Edit `src/assets/styles/global.css`

---

## 13. Development Commands

```bash
bun dev          # Start dev server (localhost:4321)
bun build        # Production build
bun preview      # Preview production build
bun lint         # Run ESLint
bun format       # Run Prettier
```

---

## 14. Deployment

### Vercel (default)
- Auto-detects Astro; zero-config deploy
- Set `output: 'server'` in `astro.config.ts` for SSR

### Static
- Set `output: 'static'` in `astro.config.ts`
- Output in `dist/`

### GitHub Pages
- Use GitHub Actions workflow
- Set `site` and `base` in `astro.config.ts`

---

## 15. Content Quality Rules
- Use clear heading hierarchy (`##`, `###`) and short sections.
- Keep paragraphs concise; avoid filler text.
- Use explicit language labels in code fences.
- Include only relevant external links.
- Prefer concrete examples and actionable guidance.

## Image Rules
- Prefer local image assets inside the post folder.
- For hero image, use relative path like `./thumbnail.jpg`.
- Always ensure referenced files actually exist.
- Add meaningful `alt` when the image carries information.

## Date and Freshness Rules
- For current-event topics, include concrete dates in text.
- If a claim can age quickly, add context date in the sentence.
- Use `updatedDate` when revising older content materially.

## Safety and Compliance
- Never include secrets, tokens, or private keys.
- Do not copy copyrighted content verbatim without attribution and compliance.
- Avoid medical/legal/financial claims without clear sourcing context.

---

## 16. Pre-Publish Checklist
- Frontmatter is valid and schema-compliant.
- `title` <= 60 chars; `description` <= 160 chars.
- No invalid/unknown frontmatter fields.
- Markdown/MDX compiles logically (imports, tags, fences closed).
- All image paths and links are valid.
- No placeholders (`TODO`, `lorem ipsum`, unfinished sections).
- Tags are focused (typically 2 to 6).

---

## 17. Hard Constraints for Agents
- **Do NOT modify** `src/content.config.ts` unless explicitly asked to change schemas.
- **Do NOT add** unsupported frontmatter fields to any content collection.
- **Do NOT edit** theme source in `packages/pure/` unless the task specifically requires it.
- **Do NOT delete** existing content without explicit instruction.
- **Do NOT depend** on `src/content/docs` as a required step for normal blog writing.
- **Always validate** that referenced image paths and links exist.
- **Always check** this `AGENTS.md` before writing blog posts — it has the authoritative rules.
- **Prefer** editing existing files over creating new ones when the change is small.

---

## 18. Fallback Rule for Future Theme Changes
If a component behavior seems different from this document:
1. Check the exact source in `packages/pure/components/**`.
2. Use the currently implemented props/slots.
3. Update this `AGENTS.md` to keep it self-contained.