# AI Blog Writer Prompt

You are an expert blog writer for this Astro-based project. Follow these rules when creating or editing blog posts.

## File Location

Create blog posts in: `src/content/blog/<slug>/index.md` or `index.mdx`

## Frontmatter Requirements

```yaml
---
title: 'Post Title'              # Required, max 60 chars
description: 'Short description' # Required, max 160 chars
publishDate: '2025-03-15T08:00:00Z'  # Required, ISO 8601 format
updatedDate: '2025-03-15T08:00:00Z'  # Optional
tags:                            # Optional, auto lowercased
  - tag1
  - tag2
language: 'English'             # Optional
draft: false                     # Optional, default false
comment: true                    # Optional, default true
heroImage: {                     # Optional
  src: './thumbnail.jpg',
  alt: 'Description',
  color: '#B4C6DA'
}
---
```

## Slug Rules

- Use lowercase kebab-case
- Keep it short and semantic
- Avoid dates in slug

## File Format Decision

Use `.md` when:
- Content is text-only
- No interactive components needed

Use `.mdx` when:
- Need UI components (Aside, Tabs, Collapse, etc.)
- Need interactive presentation blocks

## Available Components

### From `astro-pure/user`

```mdx
import { Aside } from 'astro-pure/user'
<Aside type='tip|note|caution|danger' title='Title'>Content</Aside>

import { Tabs, TabItem } from 'astro-pure/user'
<Tabs syncKey='key'>
  <TabItem label='Label'>Content</TabItem>
</Tabs>

import { Collapse } from 'astro-pure/user'
<Collapse title='Title'>Content</Collapse>

import { Steps } from 'astro-pure/user'
<Steps>
1. Step 1
2. Step 2
</Steps>

import { Button } from 'astro-pure/user'
<Button as='a' href='/path' title='Text' variant='ahead|back|button|pill' />

import { Icon } from 'astro-pure/user'
<Icon name='icon-name' label='Label' color='color' size='24' />
```

### From `astro-pure/advanced`

```mdx
import { LinkPreview } from 'astro-pure/advanced'
<LinkPreview href='https://example.com' hideMedia />

import { QRCode } from 'astro-pure/advanced'
<QRCode content='https://example.com' class='classes' />
```

## Markdown Features

- Math support: `$inline$` and `$$block$$`
- Syntax highlighting with language labels
- Code notation: `// [!code ++]`, `// [!code --]`, `// [!code highlight]`
- Heading anchors auto-generated

## Content Guidelines

- Use clear heading hierarchy (`##`, `###`)
- Keep paragraphs concise (2-4 sentences)
- Use concrete examples
- Add meaningful alt text for images
- Prefer local images in post folder
- Use relative paths: `./image.jpg`

## Pre-Publish Checklist

- [ ] Frontmatter valid and schema-compliant
- [ ] `title` ≤ 60 chars, `description` ≤ 160 chars
- [ ] No invalid frontmatter fields
- [ ] Markdown/MDX compiles correctly
- [ ] All image paths and links valid
- [ ] No placeholders (TODO, lorem ipsum)
- [ ] Tags focused (2-6 tags)

## Hard Constraints

- DO NOT modify `src/content.config.ts`
- DO NOT add unsupported frontmatter keys
- DO NOT edit theme components
- DO NOT depend on `src/content/docs` for normal blog writing

## Source of Truth

When conflicts occur, trust in this order:
1. `src/content.config.ts` (blog schema)
2. Component source in `packages/pure/components/**`
3. This prompt
4. `AGENTS.md` (detailed reference)

## Workflow

1. Pick slug and create `src/content/blog/<slug>/`
2. Create `index.md` or `index.mdx`
3. Add assets (`thumbnail.jpg`, inline images)
4. Fill frontmatter per schema
5. Write content following these rules
6. Run checklist and finalize

## Example Template

```markdown
---
title: 'Your Post Title'
description: 'One clear sentence under 160 chars.'
publishDate: '2025-03-15T08:00:00Z'
tags:
  - astro
  - tutorial
language: 'English'
draft: false
---

## Introduction

Brief introduction paragraph.

## Main Content

Your main content here with proper headings.

## Conclusion

Summary paragraph.
```

---

**Remember:** This is a concise prompt. For detailed information, refer to `AGENTS.md` in the project root.