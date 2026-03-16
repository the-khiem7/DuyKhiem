import type { CollectionEntry } from 'astro:content'

import { DEFAULT_LOCALE, type SiteLocale } from '@/utils/i18n'

export type BlogEntry = CollectionEntry<'blog'>

export type LocalizedBlogGroup = {
  baseSlug: string
  entries: Partial<Record<SiteLocale, BlogEntry>>
}

export type ResolvedLocalizedBlogEntry = {
  baseSlug: string
  locale: SiteLocale
  entry: BlogEntry
  availableLocales: SiteLocale[]
  isFallback: boolean
}

const FRONTMATTER_LOCALE_MAP: Record<string, SiteLocale> = {
  english: 'en',
  en: 'en',
  vietnamese: 'vi',
  vietnam: 'vi',
  vi: 'vi'
}

function getComparableDate(entry: BlogEntry) {
  return new Date(entry.data.updatedDate ?? entry.data.publishDate ?? 0).valueOf()
}

export function getBlogEntryLocale(entry: BlogEntry): SiteLocale {
  const maybeSuffix = entry.id.split('/').at(-1)
  if (maybeSuffix === 'en' || maybeSuffix === 'vi') return maybeSuffix

  const fromFrontmatter = entry.data.language?.trim().toLowerCase()
  if (fromFrontmatter && FRONTMATTER_LOCALE_MAP[fromFrontmatter]) {
    return FRONTMATTER_LOCALE_MAP[fromFrontmatter]
  }

  return DEFAULT_LOCALE
}

export function getBlogBaseSlug(entry: BlogEntry) {
  const segments = entry.id.split('/')
  const last = segments.at(-1)

  if (last === 'en' || last === 'vi') {
    return segments.slice(0, -1).join('/')
  }

  return entry.id
}

export function groupLocalizedBlogEntries(entries: BlogEntry[]) {
  const grouped = new Map<string, LocalizedBlogGroup>()

  for (const entry of entries) {
    const baseSlug = getBlogBaseSlug(entry)
    const locale = getBlogEntryLocale(entry)
    const existing = grouped.get(baseSlug) ?? { baseSlug, entries: {} }

    existing.entries[locale] = entry
    grouped.set(baseSlug, existing)
  }

  return Array.from(grouped.values())
}

export function resolveLocalizedBlogEntry(
  group: LocalizedBlogGroup,
  locale: SiteLocale
): ResolvedLocalizedBlogEntry | null {
  const entry = group.entries[locale] ?? group.entries.en ?? Object.values(group.entries)[0]
  if (!entry) return null

  const availableLocales = (Object.entries(group.entries) as [SiteLocale, BlogEntry][])
    .filter(([, candidate]) => !!candidate)
    .map(([candidateLocale]) => candidateLocale)

  return {
    availableLocales,
    baseSlug: group.baseSlug,
    entry,
    isFallback: getBlogEntryLocale(entry) !== locale,
    locale
  }
}

export function getLocalizedBlogEntries(entries: BlogEntry[], locale: SiteLocale) {
  return groupLocalizedBlogEntries(entries)
    .map((group) => resolveLocalizedBlogEntry(group, locale))
    .filter((entry): entry is ResolvedLocalizedBlogEntry => !!entry)
    .sort((a, b) => getComparableDate(b.entry) - getComparableDate(a.entry))
}

export function getLocalizedBlogEntryBySlug(
  entries: BlogEntry[],
  baseSlug: string,
  locale: SiteLocale
) {
  const group = groupLocalizedBlogEntries(entries).find((candidate) => candidate.baseSlug === baseSlug)
  return group ? resolveLocalizedBlogEntry(group, locale) : null
}

export function getLocalizedTagsWithCount(entries: BlogEntry[], locale: SiteLocale) {
  const tagCounts = new Map<string, number>()

  for (const post of getLocalizedBlogEntries(entries, locale)) {
    for (const tag of post.entry.data.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
    }
  }

  return [...tagCounts.entries()].sort((a, b) => b[1] - a[1])
}

export function getLocalizedPostsByTag(entries: BlogEntry[], locale: SiteLocale, tag: string) {
  return getLocalizedBlogEntries(entries, locale).filter((post) => post.entry.data.tags.includes(tag))
}

export function groupLocalizedCollectionsByYear(entries: BlogEntry[], locale: SiteLocale) {
  const grouped = new Map<number, ResolvedLocalizedBlogEntry[]>()

  for (const post of getLocalizedBlogEntries(entries, locale)) {
    const date = post.entry.data.updatedDate ?? post.entry.data.publishDate
    const year = date ? new Date(date).getFullYear() : undefined

    if (year === undefined) continue

    if (!grouped.has(year)) grouped.set(year, [])
    grouped.get(year)?.push(post)
  }

  return [...grouped.entries()].sort((a, b) => b[0] - a[0])
}
