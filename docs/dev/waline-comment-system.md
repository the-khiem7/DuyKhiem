# Waline Comment System Documentation

**Last updated:** 2026-03-16  
**Project:** DuyKhiem Portfolio (Astro 5.x + astro-theme-pure)

---

## Table of Contents

1. [Overview](#overview)
2. [Configuration](#configuration)
3. [Component Architecture](#component-architecture)
4. [Integration Guide](#integration-guide)
5. [How It Works](#how-it-works)
6. [Waline API Reference](#waline-api-reference)
7. [Self-Hosting Guide](#self-hosting-guide)
8. [Troubleshooting](#troubleshooting)

---

## Overview

### What is Waline?

Waline is a lightweight, open-source comment system designed as a simpler alternative to Disqus. Key features:

- **No login required** - Users can comment anonymously with email
- **Lightweight** - Minimal JavaScript bundle
- **Self-hostable** - Full control over your data
- **Feature-rich** - Supports reactions, pageviews, notifications, moderation

### Why Waline in This Project?

- Backend-first architecture aligns with project philosophy
- No authentication friction for commenters
- Easy to self-host and control data
- Supports Vietnamese and English locales

---

## Configuration

### Location: `src/site.config.ts`

```typescript
waline: {
  enable: true,
  // Server service link
  server: 'https://astro-theme-pure-waline.arthals.ink/',
  // Show meta info for comments
  showMeta: false,
  // Refer https://waline.js.org/en/guide/features/emoji.html
  emoji: ['bmoji', 'weibo'],
  // Refer https://waline.js.org/en/reference/client/props.html
  additionalConfigs: {
    // search: false,
    pageview: true,
    comment: true,
    locale: {
      reaction0: 'Like',
      placeholder: 'Welcome to comment. (Email to receive replies. Login is unnecessary)'
    },
    imageUploader: false
  }
}
```

### Configuration Options Explained

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enable` | boolean | `true` | Enable/disable entire comment system |
| `server` | string | required | Waline server URL |
| `showMeta` | boolean | `false` | Show metadata (IP, browser, OS) in comments |
| `emoji` | string[] | `['bmoji']` | Emoji packs to display |
| `additionalConfigs.pageview` | boolean | `true` | Enable pageview counting |
| `additionalConfigs.comment` | boolean | `true` | Enable commenting |
| `additionalConfigs.imageUploader` | boolean | `false` | Allow image uploads in comments |
| `additionalConfigs.locale` | object | - | Custom UI text translations |

### Frontmatter Control (Per-Page)

In blog posts, control comments via frontmatter:

```yaml
---
title: 'My Blog Post'
comment: true  # Enable comments for this post (default: true)
---
```

---

## Component Architecture

### File Structure

```
src/components/waline/
├── Comment.astro      # Main comment box component
├── PageInfo.astro     # Comment/like count display
└── Pageview.astro     # Pageview counter
```

---

### Comment.astro

**Purpose:** Renders the main comment box

**Key Logic:**
```astro
---
const enableWaline = config.integ.waline?.enable ?? true
const showComment = frontmatter.comment ?? enableWaline
---

{showComment && (
  <div id="waline" class="waline-container">
    <script>
      // Load Waline SDK from CDN
      const loadWaline = async () => {
        const Waline = await import('${config.npmCDN}/@waline/client@3/waline.mjs')
        Waline.init({
          el: '#waline',
          serverURL: '${config.integ.waline.server}',
          path: window.location.pathname,
          emoji: ${JSON.stringify(config.integ.waline.emoji)},
          locale: ${JSON.stringify(config.integ.waline.additionalConfigs.locale)},
          imageUploader: ${config.integ.waline.additionalConfigs.imageUploader},
          pageview: ${config.integ.waline.additionalConfigs.pageview},
          comment: ${config.integ.waline.additionalConfigs.comment}
        })
      }
      loadWaline()
    </script>
  </div>
)}
```

**Key Points:**
- Uses `client:load` directive for client-side rendering
- Dynamically imports Waline from CDN
- Uses `window.location.pathname` as unique thread identifier
- Only renders when both global `enable` and per-page `comment` are true

---

### PageInfo.astro

**Purpose:** Displays comment count and like count metadata

**Key Logic:**
```astro
---
const enableWaline = config.integ.waline?.enable ?? true
---

{enableWaline && (
  <div class="page-info">
    <span class="waline-comment-count" data-path={pathname}></span>
    <span class="waline-like-count" data-path={pathname}></span>
  </div>
)}

<script>
  const loadWaline = async () => {
    const Waline = await import('${config.npmCDN}/@waline/client@3/waline.mjs')
    
    // Get comment count
    Waline.commentCount({
      serverURL: '${config.integ.waline.server}',
      path: window.location.pathname
    })
    
    // Get like count
    Waline.likeCount({
      serverURL: '${config.integ.waline.server}',
      path: window.location.pathname
    })
  }
  loadWaline()
</script>
```

**Selectors Used:**
- `.waline-comment-count` - Element for comment count
- `.waline-like-count` - Element for like count

---

### Pageview.astro

**Purpose:** Tracks and displays pageview statistics

**Key Logic:**
```astro
---
const enableWaline = config.integ.waline?.enable ?? true
---

{enableWaline && (
  <span class="waline-pageview-count" data-path={pathname}></span>
)}

<script>
  const loadWaline = async () => {
    const Waline = await import('${config.npmCDN}/@waline/client@3/waline.mjs')
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 500)
    
    try {
      await Waline.pageviewCount({
        serverURL: '${config.integ.waline.server}',
        path: window.location.pathname,
        signal: controller.signal
      })
    } catch (e) {
      // Silently fail if timeout
    } finally {
      clearTimeout(timeoutId)
    }
  }
  loadWaline()
</script>
```

**Key Points:**
- 500ms timeout to prevent slow loading from blocking page
- Graceful error handling - fails silently
- Uses `AbortController` for cleanup

---

## Integration Guide

### Step 1: Add to Blog Post Layout

In `src/layouts/BlogPost.astro`:

```astro
---
import Comment from '../components/waline/Comment.astro'
import PageInfo from '../components/waline/PageInfo.astro'
import Pageview from '../components/waline/Pageview.astro'

const showComment = frontmatter.comment ?? config.integ.waline.enable
---

<!-- Display pageview count -->
<Pageview />

<!-- Display comment/like count -->
<PageInfo />

<!-- Render comment box -->
<Comment client:load condition={showComment} />
```

### Step 2: Configure Per-Page Comments

In blog post frontmatter:

```yaml
---
title: 'My Post'
comment: true  # Enable (default)
---

---
title: 'Closed Post'
comment: false  # Disable comments
---
```

### Step 3: Style the Comment Container

In `src/assets/styles/global.css`:

```css
.waline-container {
  margin-top: 2rem;
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.waline-container [class*='wl-'] {
  font-family: var(--font-body);
}
```

---

## How It Works

### Request Flow

```
┌─────────────────┐
│   User visits   │
│     page        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Pageview.astro  │───┐
│ increments view │   │
└─────────────────┘   │
                      │
         ┌────────────▼────────────┐
         │   Waline Server (API)   │
         │  - Store pageview       │
         │  - Store comments       │
         │  - Track reactions      │
         └────────────┬────────────┘
                      │
         ┌────────────▼────────────┐
         │   Comment.astro loads   │
         │   comment box UI        │
         └─────────────────────────┘
```

### Data Storage

Waline stores data by **path** (URL pathname):

| Path | Data Stored |
|------|-------------|
| `/blog/my-post/en` | Comments, likes, pageviews for English version |
| `/blog/my-post/vi` | Comments, likes, pageviews for Vietnamese version |

**Important:** Each language version has separate comment threads!

### Comment Submission Flow

1. User types comment + enters email
2. Client validates input
3. POST request to Waline server `/api/comment`
4. Server validates and stores comment
5. Comment appears immediately (may require moderation)
6. Email notification sent to replied users

---

## Waline API Reference

### Client-Side Functions

| Function | Purpose | Parameters |
|----------|---------|------------|
| `Waline.init()` | Initialize comment box | `el`, `serverURL`, `path`, `emoji`, `locale`, etc. |
| `Waline.commentCount()` | Get comment count | `serverURL`, `path` |
| `Waline.likeCount()` | Get like count | `serverURL`, `path` |
| `Waline.pageviewCount()` | Increment/get pageviews | `serverURL`, `path`, `signal` |

### Example: Manual Initialization

```javascript
import Waline from '@waline/client'

Waline.init({
  el: '#waline',
  serverURL: 'https://your-waline-server.com',
  path: window.location.pathname,
  emoji: ['bmoji', 'weibo'],
  locale: {
    placeholder: 'Write a comment...'
  },
  requiredMeta: ['nick', 'mail'],
  imageUploader: true
})
```

---

## Self-Hosting Guide

### Why Self-Host?

- Full data ownership
- No rate limits
- Custom branding
- Better privacy compliance (GDPR)

### Deployment Options

#### Option 1: Vercel (Recommended for beginners)

1. Clone Waline repo: `https://github.com/walinejs/waline`
2. Connect to Vercel
3. Set environment variables:
   - `SITE_NAME`: Your site name
   - `SECURE_KEY`: Random secret
4. Deploy

#### Option 2: Railway

1. Create new project on Railway
2. Deploy from Waline template
3. Add MongoDB/MySQL database
4. Configure environment variables

#### Option 3: Docker (Self-hosted)

```bash
docker run -d \
  --name waline \
  -p 8360:8360 \
  -e SITE_NAME="Your Site" \
  -e SECURE_KEY="your-secret-key" \
  -e MONGODB_URL="mongodb://mongo:27017/waline" \
  ghcr.io/walinejs/waline
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SITE_NAME` | Yes | Site display name |
| `SECURE_KEY` | Yes | Encryption key for cookies |
| `MONGODB_URL` | Yes* | MongoDB connection string |
| `MYSQL_URL` | Yes* | MySQL connection string |
| `JWT_TOKEN` | No | JWT secret for auth |

*Choose one database type

### Update Project Config

After deploying your own server:

```typescript
// src/site.config.ts
waline: {
  enable: true,
  server: 'https://your-waline-server.vercel.app/',
  // ... rest of config
}
```

---

## Troubleshooting

### Comments Not Loading

**Check:**
1. `enable: true` in `site.config.ts`
2. `comment: true` in frontmatter (or remove to use default)
3. Waline server URL is accessible
4. Browser console for errors

**Fix:**
```typescript
// Add logging for debugging
console.log('Waline config:', config.integ.waline)
```

### Pageview Not Incrementing

**Possible causes:**
- Timeout (500ms) too short
- Server rate limiting
- CORS issues

**Fix:**
```astro
<!-- In Pageview.astro, increase timeout -->
const timeoutId = setTimeout(() => controller.abort(), 2000)
```

### Email Notifications Not Working

**Check:**
1. Waline server has email configured
2. SMTP settings on server
3. User entered valid email

### CORS Errors

**Fix on Waline server:**
```env
ALLOWED_ORIGINS=https://your-domain.com
```

### Styling Issues

**Add custom CSS:**
```css
/* src/assets/styles/global.css */
.waline-container {
  --waline-theme-color: #007bff;
  --waline-bg-color: #fff;
}
```

---

## Related Files

| File | Purpose |
|------|---------|
| `src/site.config.ts` | Main Waline configuration |
| `src/components/waline/Comment.astro` | Comment box component |
| `src/components/waline/PageInfo.astro` | Comment/like counter |
| `src/components/waline/Pageview.astro` | Pageview counter |
| `src/layouts/BlogPost.astro` | Blog post layout with comment integration |

---

## Resources

- **Official Docs:** https://waline.js.org/
- **GitHub:** https://github.com/walinejs/waline
- **Demo Server:** https://waline.js.org/demo.html
- **Vercel Deploy:** https://github.com/walinejs/waline-vercel

---

## Version History

| Date | Change |
|------|--------|
| 2026-03-16 | Initial documentation |