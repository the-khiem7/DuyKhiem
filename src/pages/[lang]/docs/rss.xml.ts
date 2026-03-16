import { SUPPORTED_LOCALES } from '@/utils/i18n'

export const prerender = true

export function getStaticPaths() {
  return SUPPORTED_LOCALES.map((lang) => ({ params: { lang } }))
}

export function GET({ request }: { request: Request }) {
  return new Response(null, {
    status: 302,
    headers: {
      Location: new URL('/docs/rss.xml', request.url).toString()
    }
  })
}
