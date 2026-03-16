import type { AstroGlobal, ImageMetadata } from 'astro'
import { getImage } from 'astro:assets'
import type { CollectionEntry } from 'astro:content'
import rss from '@astrojs/rss'
import type { Root } from 'mdast'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'

import { getBlogCollection } from 'astro-pure/server'
import config from '@/site-config'
import { getLocalizedBlogEntries } from '@/utils/blog-i18n'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type SiteLocale } from '@/utils/i18n'

export const prerender = true

const imagesGlob = import.meta.glob<{ default: ImageMetadata }>(
  '/src/content/blog/**/*.{jpeg,jpg,png,gif,avif,webp}'
)

const renderContent = async (
  post: ReturnType<typeof getLocalizedBlogEntries>[number],
  site: URL
) => {
  function remarkReplaceImageLink() {
    return async (tree: Root) => {
      const promises: Promise<void>[] = []
      visit(tree, 'image', (node) => {
        if (node.url.startsWith('/images')) {
          node.url = `${site}${node.url.replace('/', '')}`
        } else {
          const imagePathPrefix = `/src/content/blog/${post.baseSlug}/${node.url.replace('./', '')}`
          const promise = imagesGlob[imagePathPrefix]?.().then(async (res) => {
            const imagePath = res?.default
            if (imagePath) {
              node.url = `${site}${(await getImage({ src: imagePath })).src.replace('/', '')}`
            }
          })
          if (promise) promises.push(promise)
        }
      })
      await Promise.all(promises)
    }
  }

  const file = await unified()
    .use(remarkParse)
    .use(remarkReplaceImageLink)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(post.entry.body)

  return String(file)
}

export async function GET(context: AstroGlobal) {
  const locale = (context.params.lang ?? DEFAULT_LOCALE) as SiteLocale
  const allPosts = (await getBlogCollection()) as CollectionEntry<'blog'>[]
  const localizedPosts = getLocalizedBlogEntries(allPosts, locale)
  const siteUrl = context.site ?? new URL(import.meta.env.SITE)

  return rss({
    trailingSlash: false,
    xmlns: { h: 'http://www.w3.org/TR/html4/' },
    stylesheet: '/scripts/pretty-feed-v3.xsl',
    title: `${config.title} (${locale.toUpperCase()})`,
    description: config.description || '',
    site: import.meta.env.SITE,
    items: await Promise.all(
      localizedPosts.map(async (post) => ({
        pubDate: post.entry.data.publishDate,
        link: `/${locale}/blog/${post.baseSlug}`,
        customData: `<h:img src="${typeof post.entry.data.heroImage?.src === 'string' ? post.entry.data.heroImage?.src : post.entry.data.heroImage?.src.src}" />
          <enclosure url="${typeof post.entry.data.heroImage?.src === 'string' ? post.entry.data.heroImage?.src : post.entry.data.heroImage?.src.src}" />`,
        content: await renderContent(post, siteUrl),
        ...post.entry.data
      }))
    )
  })
}

export function getStaticPaths() {
  return SUPPORTED_LOCALES.map((lang) => ({ params: { lang } }))
}
