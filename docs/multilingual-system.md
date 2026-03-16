# Multilingual Blog System

## Muc tieu

Thay vi xem `en.mdx` va `vi.mdx` la hai bai blog doc lap, he thong can hoat dong theo mo hinh:

- co mot `global language switcher`
- moi locale chi hien thi mot phien ban cua moi bai
- neu locale hien tai khong co bai tuong ung thi fallback sang ban `en`

## Hien trang

Blog collection hien tai load tat ca file trong `src/content/blog/**/*.{md,mdx}`.

Vi du:

- `src/content/blog/nab-technical-interview-log/en.mdx`
- `src/content/blog/nab-technical-interview-log/vi.mdx`

Astro xem day la 2 `CollectionEntry<'blog'>` khac nhau, nen:

- trang list `/blog` hien thi 2 post
- route detail sinh theo `post.id`, nen URL dang theo kieu `/blog/<slug>/<lang>`
- khong co khai niem "mot bai, nhieu ban dich"

## Rang buoc quan trong

Site dang duoc cau hinh `prerender: true`.

Dieu nay rat quan trong vi:

- neu chi dung `localStorage` hoac cookie de doi ngon ngu thi build static se khong biet can render danh sach bai nao
- fallback theo ngon ngu se chi xay ra o client, gay nhay UI va SEO khong tot
- RSS, canonical, pagefind, internal link se kho dong bo

Vi vay, co che phu hop nhat la **locale nam trong path**.

## Kien truc de xuat

### 1. Locale la global state o muc URL

Dung path prefix:

- `/en/...`
- `/vi/...`

Vi du:

- `/en/blog`
- `/vi/blog`
- `/en/blog/nab-technical-interview-log`
- `/vi/blog/nab-technical-interview-log`

`LanguageSwitcher` chi can doi prefix toan site, nen van la "global switcher", nhung van than thien voi static build.

### 2. Blog identity tach khoi file content

Can xem `baseSlug` la danh tinh chinh cua bai.

Vi du:

- `src/content/blog/nab-technical-interview-log/en.mdx`
- `src/content/blog/nab-technical-interview-log/vi.mdx`

thi:

- `baseSlug = nab-technical-interview-log`
- `lang = en | vi`

He thong can co utility gom cac entry theo `baseSlug`.

Output mong muon:

```ts
type BlogLocale = 'en' | 'vi'

type LocalizedBlogGroup = {
  baseSlug: string
  entries: Partial<Record<BlogLocale, CollectionEntry<'blog'>>>
}
```

### 3. Quy tac chon phien ban hien thi

Ham trung tam:

```ts
pickLocalizedEntry(group, locale) =>
  group.entries[locale] ?? group.entries.en ?? firstAvailableEntry
```

Quy tac nay ap dung cho:

- blog list
- blog detail
- related posts
- RSS
- search index neu can

### 4. Hanh vi cua blog list

Tai `/vi/blog`:

- moi `baseSlug` chi xuat hien 1 lan
- uu tien bai `vi`
- neu khong co `vi` thi hien bai `en`

Tai `/en/blog`:

- moi `baseSlug` chi xuat hien 1 lan
- uu tien bai `en`

He qua:

- khong con duplicate post trong list
- fallback xay ra o muc du lieu, khong phai UI hack

### 5. Hanh vi cua blog detail

Route detail nen chuyen tu:

- `/blog/<slug>/<lang>`

sang:

- `/<lang>/blog/<baseSlug>`

Quy tac:

- `/vi/blog/foo` -> lay `vi` neu co
- neu `vi` khong co -> lay `en`
- neu `foo` khong ton tai o bat ky ngon ngu nao -> 404

Nhu vay user luon o trong locale context toan cuc, nhung van doc duoc bai fallback.

## Vi sao khong nen giu co che `/blog/<slug>/<lang>`

Co the giu URL cu, nhung no khong phan anh "global language".

Neu van giu route cu:

- switcher global phai rewrite tung link detail theo file-level locale
- menu `/blog`, related posts, RSS van can them mot lop map locale
- UX se mo ho: user dang o `vi`, nhung route detail lai phu thuoc vao file cu the

Tom lai, route theo `baseSlug` + `locale prefix` sach hon va de mo rong hon.

## Cac thay doi can lam

### A. Them utility i18n cho blog

Tao mot file utility, vi du:

- `src/utils/blog-i18n.ts`

No se lo:

- parse `entry.id` thanh `baseSlug` va `lang`
- group entries theo `baseSlug`
- pick entry theo locale voi fallback `en`
- tra ve danh sach post da de-duplicate theo locale

### B. Tao route co locale prefix

Can them:

- `src/pages/[lang]/blog/[...page].astro`
- `src/pages/[lang]/blog/[slug].astro`

Neu muon mo rong global locale cho ca site, co the them tiep:

- `src/pages/[lang]/index.astro`
- `src/pages/[lang]/projects/...`
- `src/pages/[lang]/about/...`

Nhung cho phase 1, chi can blog la du.

### C. Swizzle Header va them `LanguageSwitcher`

Can tao local copy:

- `src/components/Header.astro`
- `src/components/LanguageSwitcher.astro`

Sau do cap nhat `BaseLayout` de import header local thay vi header cua theme package.

`LanguageSwitcher` can:

- doc locale hien tai tu pathname
- doi giua `en` va `vi`
- giu ngu canh hien tai neu co the
- neu dang o blog detail thi doi sang URL detail cung `baseSlug`
- neu dang o blog list thi doi `/en/blog` <-> `/vi/blog`

### D. Cap nhat link generation

Nhung noi hien dang dung `href={`/blog/${id}`}` can doi.

Can cap nhat:

- `PostPreview`
- `ArticleBottom` neu dang de xuat bai viet lien quan theo `id`
- blog index
- RSS
- canonical/hreflang trong `BaseHead`

### E. Backward compatibility

Nen giu redirect de khong vo link cu:

- `/blog/<slug>/en` -> `/en/blog/<slug>`
- `/blog/<slug>/vi` -> `/vi/blog/<slug>`
- `/blog/<slug>` -> `/en/blog/<slug>` neu bai cu chi co 1 ngon ngu

Neu Astro static route redirect bat tien, co the xu ly bang:

- `vercel.json`
- middleware neu chuyen sang SSR
- hoac tao page redirect nhe trong Astro

## SEO va metadata

Can bo sung:

- `canonical` theo locale da resolve
- `hreflang="en"` va `hreflang="vi"` neu co ban dich
- `x-default` tro ve `en`

Neu `/vi/blog/foo` dang fallback sang `en`, van nen:

- render content `en`
- nhung canonical phai ro rang theo chien luoc da chon

De don gian, phase 1 co the canonical vao chinh URL dang xem. Phase 2 moi them `hreflang` day du.

## RSS va search

RSS hien tai dang map tren tung `CollectionEntry`, nen se bi duplicate theo ngon ngu.

Can quyet dinh 1 trong 2 chinh sach:

- 1 feed moi locale: `/en/rss.xml`, `/vi/rss.xml`
- hoac 1 feed mac dinh `en`

Khuyen nghi:

- tach feed theo locale

Pagefind/Search cung nen index theo locale route neu muon trai nghiem nhat quan.

## Lo trinh implementation de xuat

### Phase 1: Data layer

- viet utility group post theo `baseSlug`
- viet ham `pickLocalizedEntry`
- cap nhat blog list de khong duplicate

### Phase 2: Route layer

- them route `/<lang>/blog`
- them route detail `/<lang>/blog/<baseSlug>`
- fallback sang `en`

### Phase 3: Global switcher

- swizzle `Header`
- them `LanguageSwitcher`
- giu ngu canh trang khi doi locale

### Phase 4: SEO + RSS + redirect

- canonical/hreflang
- RSS theo locale
- redirect tu URL cu

## Ket luan

Co che phu hop nhat cho project hien tai la:

- **global language = locale trong URL**
- **blog identity = `baseSlug`, khong phai file**
- **render theo locale, fallback sang `en`**

Day la cach:

- khop voi Astro static build
- giai quyet duplicate post
- de SEO hon
- de them global switcher ma khong can dua vao client-only state
