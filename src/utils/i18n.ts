export const SUPPORTED_LOCALES = ['en', 'vi'] as const

export type SiteLocale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: SiteLocale = 'en'

const LOCALE_LABELS: Record<SiteLocale, string> = {
  en: 'English',
  vi: 'Tiếng Việt'
}

export function isSupportedLocale(value: string | undefined): value is SiteLocale {
  return SUPPORTED_LOCALES.includes(value as SiteLocale)
}

export function normalizeLocale(value: string | undefined | null): SiteLocale {
  return isSupportedLocale(value ?? undefined) ? (value as SiteLocale) : DEFAULT_LOCALE
}

export function getLocaleLabel(locale: SiteLocale) {
  return LOCALE_LABELS[locale]
}

export function getHtmlLang(locale: SiteLocale) {
  return locale === 'vi' ? 'vi-VN' : 'en-US'
}

export function getCurrentLocale(pathname: string): SiteLocale {
  const [, maybeLocale] = pathname.split('/')
  return normalizeLocale(maybeLocale)
}

export function resolveLocaleParam(value: string | number | undefined | null): SiteLocale {
  return normalizeLocale(typeof value === 'string' ? value : undefined)
}

export function getLocaleStaticPaths() {
  return SUPPORTED_LOCALES.map((lang) => ({ params: { lang } }))
}

export function stripLocaleFromPathname(pathname: string) {
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length > 0 && isSupportedLocale(segments[0])) {
    return `/${segments.slice(1).join('/')}`.replace(/\/$/, '') || '/'
  }

  return pathname || '/'
}

export function withLocalePath(locale: SiteLocale, pathname: string) {
  const normalizedPath = stripLocaleFromPathname(pathname)
  return normalizedPath === '/' ? `/${locale}` : `/${locale}${normalizedPath}`
}

export function getLocaleAlternates(pathname: string) {
  const normalizedPath = stripLocaleFromPathname(pathname)
  return SUPPORTED_LOCALES.map((locale) => ({
    href: withLocalePath(locale, normalizedPath),
    hreflang: locale
  }))
}

export function switchLocalePath(pathname: string, locale: SiteLocale) {
  return withLocalePath(locale, pathname)
}
