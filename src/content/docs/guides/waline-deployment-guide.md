---
title: 'Waline Comment System Deployment Guide'
description: 'Complete guide for deploying and configuring Waline comment system for your Astro site'
publishDate: '2025-03-16'
tags:
  - waline
  - comments
  - deployment
  - vercel
---

# Waline Comment System Deployment Guide

This guide covers everything you need to know about deploying and configuring Waline comment system for your Astro portfolio site.

## Overview

Waline is a lightweight, fast, and feature-rich comment system that can be self-hosted. It provides:

- **Anonymous commenting** with email notification
- **Reactions/emoji support** for quick feedback
- **Pageview counting** for blog posts
- **Markdown support** in comments
- **Multiple database backends** (SQLite, MySQL, PostgreSQL, MongoDB)
- **Vercel deployment** with serverless functions

## Current Configuration

The site's Waline configuration is located in `src/site.config.ts`:

```typescript
waline: {
  enable: true,
  server: 'https://astro-theme-pure-waline.arthals.ink/',
  showMeta: false,
  emoji: ['bmoji', 'weibo'],
  additionalConfigs: {
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

## Deployment Options

### Option 1: Vercel (Recommended)

The easiest way to deploy Waline is using Vercel's serverless functions.

#### Step 1: Clone Waline Vercel Template

```bash
git clone https://github.com/walinejs/vercel.git waline-vercel
cd waline-vercel
```

#### Step 2: Configure Environment Variables

Create a `.env` file or set environment variables in Vercel dashboard:

```bash
# Required: SQLite database path (for serverless)
SQLITE_DB_PATH=/tmp/waline.db

# Optional: Admin email for notifications
ADMIN_EMAIL=your-email@example.com

# Optional: Site name
SITE_NAME=Your Site Name

# Optional: GitHub OAuth for login (recommended for production)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Optional: Email service for notifications
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

#### Step 3: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Step 4: Get Your Server URL

After deployment, Vercel will provide a URL like:
```
https://waline-your-project.vercel.app
```

This is your `server` URL for the Waline configuration.

### Option 2: Docker Deployment

For more control, deploy Waline using Docker:

```bash
docker run -d \
  --name waline \
  -p 8360:8360 \
  -v $(pwd)/data:/app/data \
  -e SQLITE_DB_PATH=/app/data/waline.db \
  -e JWT_TOKEN=your-secret-jwt-token \
  wlzjs/waline:latest
```

### Option 3: Railway/Render

Both Railway and Render support Waline deployment:

1. Go to [Railway](https://railway.app/) or [Render](https://render.com/)
2. Create a new project from the Waline template
3. Configure environment variables
4. Deploy and get your server URL

## Configuration Options

### Basic Configuration

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `enable` | boolean | Yes | Enable/disable Waline |
| `server` | string | Yes | Your Waline server URL |
| `showMeta` | boolean | No | Show comment metadata |
| `emoji` | string[] | No | Emoji sets to display |

### Additional Configurations

```typescript
additionalConfigs: {
  // Enable pageview counting
  pageview: true,
  
  // Enable comments
  comment: true,
  
  // Disable search feature
  search: false,
  
  // Custom locale strings
  locale: {
    reaction0: 'Like',
    reaction1: 'Love',
    reaction2: 'Laugh',
    reaction3: 'Wow',
    reaction4: 'Sad',
    reaction5: 'Angry',
    placeholder: 'Your custom placeholder text'
  },
  
  // Disable image upload
  imageUploader: false,
  
  // Required roles for commenting
  requiredMeta: ['nick', 'mail'],
  
  // Word limit per comment
  wordLimit: 1000,
  
  // Enable login
  login: 'enable' // 'enable' | 'disable' | 'force'
}
```

### Emoji Sets

Available emoji sets:
- `bmoji` - Default emoji set
- `weibo` - Weibo emoji
- `twemoji` - Twitter emoji
- `blob` - Blob emoji
- `alis` - Ali emoji

## Security Considerations

### Environment Variables (Keep Secret)

Never commit these to version control:

```bash
# JWT token for authentication
JWT_TOKEN=your-secret-token

# Database credentials
MYSQL_HOST=xxx
MYSQL_USER=xxx
MYSQL_PASSWORD=xxx
MYSQL_DB=xxx

# OAuth credentials
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx

# Email service
SMTP_USER=xxx
SMTP_PASS=xxx
```

### Recommended Security Settings

```typescript
waline: {
  enable: true,
  server: 'https://your-waline-server.vercel.app',
  additionalConfigs: {
    // Require email for comments (reduces spam)
    requiredMeta: ['nick', 'mail'],
    
    // Set word limit
    wordLimit: 1000,
    
    // Enable login for better moderation
    login: 'enable',
    
    // Disable image upload if not needed
    imageUploader: false
  }
}
```

## Admin Panel

Waline provides an admin panel for moderating comments:

1. Visit `https://your-waline-server.vercel.app/ui`
2. Login with your admin credentials
3. Manage comments, users, and settings

### Setting Up Admin

Add to your environment variables:

```bash
# Admin email (receives notifications)
ADMIN_EMAIL=your-email@example.com

# Admin nickname
ADMIN_NICK=Your Name
```

## Troubleshooting

### Comments Not Loading

1. Check if `server` URL is correct and accessible
2. Verify CORS settings on your Waline server
3. Check browser console for errors

### Database Errors

For SQLite on Vercel:
- Ensure `SQLITE_DB_PATH` points to `/tmp/` directory
- Vercel serverless has ephemeral storage

For production, consider:
- MongoDB Atlas (free tier available)
- PlanetScale (MySQL compatible)
- Supabase (PostgreSQL)

### Email Notifications Not Working

1. Verify SMTP settings are correct
2. Check if your email provider allows app passwords
3. For Gmail, enable "Less secure app access" or use App Password

## Migration Guide

### From Disqus

Waline supports importing Disqus comments:

1. Export comments from Disqus (XML format)
2. Use Waline's import tool:
```bash
npx @waline/cli import disqus --input disqus.xml --server https://your-server
```

### From Other Systems

Waline supports importing from:
- Artalk
- Valine
- Custom JSON format

## Cost Estimation

### Vercel Free Tier

- 100GB bandwidth/month
- 100GB serverless function execution
- Suitable for personal blogs with moderate traffic

### Paid Options

- **Vercel Pro**: $20/month for more bandwidth
- **Railway**: $5/month starter plan
- **Self-hosted VPS**: $5-10/month (DigitalOcean, Linode)

## Quick Start Checklist

- [ ] Choose deployment platform (Vercel recommended)
- [ ] Clone Waline repository
- [ ] Configure environment variables
- [ ] Deploy to your platform
- [ ] Get your server URL
- [ ] Update `src/site.config.ts` with new server URL
- [ ] Test comment functionality
- [ ] Set up admin panel
- [ ] Configure email notifications (optional)
- [ ] Set up OAuth login (optional but recommended)

## Resources

- [Waline Official Documentation](https://waline.js.org/)
- [Waline Vercel Template](https://github.com/walinejs/vercel)
- [Waline Docker Image](https://hub.docker.com/r/wlzjs/waline)
- [Waline Client Props](https://waline.js.org/en/reference/client/props.html)

## Support

For issues and questions:
- [Waline GitHub Issues](https://github.com/walinejs/waline/issues)
- [Waline Discussions](https://github.com/walinejs/waline/discussions)