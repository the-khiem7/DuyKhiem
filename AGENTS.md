# AGENTS.md

## Mission
This file is the **single writing playbook** for AI agents creating blog content in this repository.

If this playbook and source schema are followed, agents do **not** need to read `src/content/docs` for normal blog authoring.

## Scope
Applies to:
- New posts in `src/content/blog`
- Updates to existing blog posts (`.md` and `.mdx`)

Does not apply to:
- Theme/library development in `packages/pure`
- Docs site maintenance in `src/pages/docs`
- Content schema changes in `src/content.config.ts`

## Source of Truth
When conflicts happen, trust in this order:
1. `src/content.config.ts` (blog schema)
2. Actual component source under `packages/pure/components/**`
3. This `AGENTS.md`

## Required Folder Layout
Preferred layout for every post:
- `src/content/blog/<slug>/index.md`
- or `src/content/blog/<slug>/index.mdx`
- local assets beside the post, e.g. `thumbnail.jpg`

Slug rules:
- use lowercase kebab-case
- keep it short and semantic
- avoid dates in slug unless explicitly requested

## Blog Frontmatter Contract (Strict)
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

## Markdown and MDX Decision Rules
Use `.md` when:
- content is text-first
- no component UI is needed

Use `.mdx` when:
- you need Astro-style component tags (`<Aside>`, `<Tabs>`, etc.)
- you need richer interactive presentation blocks

Do not use MDX for plain prose.

## Markdown Features Available in This Repo
Configured in `astro.config.ts` and theme integration:
- math support (`remark-math`, `rehype-katex`)
- heading anchors/autolink
- shiki syntax highlighting
- code title and notation support
  - add line: `// [!code ++]`
  - remove line: `// [!code --]`
  - highlight line: `// [!code highlight]`

## MDX Runtime Model (Important)
- In `.mdx`, import components at top-level and render with JSX-style tags.
- This is Astro MDX, so component syntax is similar to `.astro` usage.
- `slot='...'` is supported if that component exposes slots.
- Keep trees shallow; avoid deeply nested UI in normal blog posts.

## Supported Component Libraries
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

## Known-Good MDX Snippets

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

## Content Quality Rules
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

## Pre-Publish Checklist
- Frontmatter is valid and schema-compliant.
- `title` <= 60 chars; `description` <= 160 chars.
- No invalid/unknown frontmatter fields.
- Markdown/MDX compiles logically (imports, tags, fences closed).
- All image paths and links are valid.
- No placeholders (`TODO`, `lorem ipsum`, unfinished sections).
- Tags are focused (typically 2 to 6).

## Hard Constraints for Agents
- Do not modify `src/content.config.ts` when only writing posts.
- Do not add unsupported frontmatter keys.
- Do not edit theme components unless explicitly requested.
- Do not depend on `src/content/docs` as a required step for normal blog writing.

## Minimal Authoring Workflow
1. Pick slug and create `src/content/blog/<slug>/`.
2. Create `index.md` or `index.mdx`.
3. Add assets (`thumbnail.jpg`, inline images).
4. Fill frontmatter per schema.
5. Write content using this playbook.
6. Run checklist and finalize.

## Fallback Rule for Future Theme Changes
If a component behavior seems different from this document:
1. Check the exact source in `packages/pure/components/**`.
2. Use the currently implemented props/slots.
3. Update this `AGENTS.md` to keep it self-contained.
