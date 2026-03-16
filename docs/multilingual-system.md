# Multilingual System Direction

## Muc tieu

Portfolio nay khong chi co blog. Blog chi la mot tinh nang trong toan bo website.
Vi vay, he thong da ngon ngu can giai quyet dong thoi 2 bai toan:

- `global language switcher` cho toan site
- locale phu hop cho tung loai page
- fallback hop ly khi thieu ban dich
- mo rong duoc cho `home`, `about`, `projects`, `links`, `blog`, `docs`

Muc tieu cuoi cung la mot kien truc `hybrid i18n`, thay vi ep moi page vao cung mot kieu i18n.

## Ket luan ngan

Nen tach i18n thanh 3 lop:

1. `Route i18n`
- Dung locale trong URL: `/en/...`, `/vi/...`
- Day la lop nen cho toan site

2. `Content i18n`
- Dung cho content-heavy pages nhu `blog`, `docs`
- Moi bai hoac moi document la mot thuc the co nhieu ban dich
- Fallback theo `document`

3. `Static/Page i18n`
- Dung cho `home`, `about`, `projects overview`, `links`
- Noi dung duoc luu bang `ts object`, khong nhat thiet phai la `md/mdx`
- Fallback theo `object inheritance`

## Vi sao khong nen dung mot cach duy nhat

Neu chi dung `md/mdx` cho tat ca:

- homepage va about se bi ep thanh content document
- kho giu layout Astro hien tai
- kho to chuc card, CTA, section, image, stat, timeline

Neu chi dung `string dictionary` cho tat ca:

- blog va docs se tro nen kho quan ly
- noi dung dai khong con phu hop voi markdown workflow
- kho giu asset, frontmatter, heading, toc, prose

Vay nen can chia theo ban chat cua tung page.

## Route i18n la lop nen

Locale nen nam trong URL:

- `/en`
- `/vi`
- `/en/about`
- `/vi/about`
- `/en/projects`
- `/vi/projects`
- `/en/blog/foo`
- `/vi/blog/foo`

Ly do:

- than thien voi `prerender: true`
- SEO tot hon
- co canonical va `hreflang` ro rang
- global switcher de giu ngu canh trang
- khong phu thuoc vao `localStorage` de quyet dinh noi dung server-render

## Nhom 1: Content i18n cho blog va docs

Ap dung cho:

- `blog`
- `docs`
- bat ky page nao ma noi dung chu yeu la bai viet hoac tai lieu

### Dac diem

- moi item co nhieu file ngon ngu
- vi du:
  - `src/content/blog/my-post/en.mdx`
  - `src/content/blog/my-post/vi.mdx`
- can co `baseSlug` lam danh tinh chinh

### Fallback

Fallback nen o muc `document`:

- vao locale hien tai neu ton tai
- neu khong co thi fallback ve `en`
- neu khong co `en` thi moi can can nhac fallback tiep

### Vi sao phu hop

- giu duoc frontmatter
- giu duoc markdown va MDX workflow
- de quan ly asset trong folder bai viet
- phu hop voi bai dai, heading, code block, toc

## Nhom 2: Static/Page i18n cho home, about, projects

Ap dung cho:

- `homepage`
- `about`
- `projects landing`
- `links`
- cac page Astro mang tinh composition

### Ban chat cua nhom nay

Nhung page nay khong phai la "mot bai viet". Chung la mot tap hop cac thanh phan UI:

- hero
- section
- cards
- CTA
- labels
- list
- stats
- timeline

Noi dung cua chung nen duoc xem la `page data`, khong phai `article content`.

### Cach luu tru de xuat

Dung file `ts` cho moi page, moi locale.

Vi du:

- `src/i18n/pages/home/en.ts`
- `src/i18n/pages/home/vi.ts`
- `src/i18n/pages/about/en.ts`
- `src/i18n/pages/about/vi.ts`

Mau du lieu:

```ts
export const homeEn = {
  hero: {
    title: 'Nguyen Van Duy Khiem',
    description: 'Backend-first engineer building workflow-heavy systems...'
  },
  about: {
    title: 'About',
    paragraphs: [
      'Software Engineering Student at FPT University',
      'I focus on backend systems...'
    ],
    cta: 'More about me'
  }
}
```

```ts
export const homeVi = {
  hero: {
    description: 'Ky su thien ve backend, xay dung cac he thong workflow...'
  },
  about: {
    title: 'Gioi thieu',
    cta: 'Xem them ve toi'
  }
}
```

Trong `HomePage.astro`, page se lay dictionary theo locale roi render.

## Tai sao nen dung TS thay vi JSON

`ts` phu hop hon `json` trong repo nay vi:

- co typing
- de autocomplete
- co the tai su dung type giua cac page
- de viet nested object lon
- co the gom ca text va metadata phuc vu component render

No khong co nghia la bo layout sang TypeScript.
Layout van o `.astro`.
Chi co `copy va page data` duoc tach ra thanh object.

## Co nen dung string list inheritance khong

Co, nhung chi nen dung cho `static/page i18n`.

### Cach nghi dung

- `en` la base
- `vi` la object override mot phan
- luc runtime hoac build-time, merge `en + vi`
- field nao `vi` chua co thi tu dong fallback ve `en`

Vi du:

```ts
const homeEn = {
  hero: {
    title: 'Nguyen Van Duy Khiem',
    cta: 'More about me'
  }
}

const homeVi = {
  hero: {
    cta: 'Xem them ve toi'
  }
}
```

Sau khi merge:

- `hero.title` lay tu `en`
- `hero.cta` lay tu `vi`

### Khi nao nen dung

Nen dung cho:

- `home`
- `about`
- `projects overview`
- `links`
- `header/footer/shared labels`

Khong nen dung cho:

- `blog post`
- `docs article`
- noi dung dai dang document

Voi content-heavy pages, fallback nen o cap document, khong phai cap tung string.

## Kien truc hybrid de xuat

```text
src/
  i18n/
    core/
      locales.ts
      dictionary.ts
      merge.ts
    shared/
      en.ts
      vi.ts
    pages/
      home/
        en.ts
        vi.ts
      about/
        en.ts
        vi.ts
      projects/
        en.ts
        vi.ts
```

Va content-heavy pages van o:

```text
src/content/blog/<slug>/en.mdx
src/content/blog/<slug>/vi.mdx
src/content/docs/.../en.mdx
src/content/docs/.../vi.mdx
```

## Quy tac fallback

### 1. Route level

- locale khong hop le thi fallback ve `en`

### 2. Static page level

- doc page dictionary theo locale
- neu field thieu, fallback ve `en` bang merge helper

### 3. Content level

- neu document locale hien tai khong ton tai, fallback ve document `en`

## Quy tac ap dung cho portfolio nay

### Home

- van la `.astro`
- text, section title, CTA, experience copy dua sang `ts`
- co the inheritance tu `en`

### About

- neu page nay chu yeu la Astro sections thi dung `ts`
- neu sau nay muon bien no thanh mot bai gioi thieu dai, co the can nhac `mdx`

### Projects

Can tach 2 truong hop:

- `projects landing`:
  - dung `ts` cho title, intro, category labels, CTA
- `project detail`:
  - neu tiep tuc la content collection thi co the xet i18n theo content sau

### Blog

- giu theo `md/mdx`
- fallback theo `baseSlug`

### Docs

- neu docs can da ngon ngu thi nen di theo content i18n giong blog

## Lo trinh implementation de xuat

### Phase A: Chot abstraction

- chot `SUPPORTED_LOCALES`
- chot helper lay locale tu URL
- chot merge strategy cho static dictionaries

### Phase B: Shared UI copy

- dua cac string chung cua header, footer, labels vao `shared dictionaries`

### Phase C: Home page i18n

- tach text homepage sang `src/i18n/pages/home`
- page Astro render tu data locale

### Phase D: About va projects landing

- lap lai pattern cua home

### Phase E: Hoan thien docs/blog alignment

- giu content-heavy pages tren co che content i18n
- bo sung `hreflang`, canonical, RSS neu can

## Nguyen tac thiet ke can giu

- khong ep moi page sang `mdx`
- khong ep moi page sang string-only dictionary
- route locale la nen chung
- page Astro van la noi render UI
- `ts` chi dong vai tro la noi chua page copy va page data
- content-heavy pages van giu markdown workflow

## De xuat quyet dinh

Kien truc nen duoc phe duyet la:

- dung `url-based locale routing` cho toan site
- dung `content i18n` cho `blog` va `docs`
- dung `ts-based page dictionaries` cho `home`, `about`, `projects landing`, `links`
- dung `inheritance from en` cho static/page dictionaries

Day la cach phu hop nhat voi mot portfolio site co ca:

- page composition bang Astro
- content dai bang MD/MDX
- nhu cau fallback
- nhu cau global language switcher

## Scope cua dot implement tiep theo

Neu phe duyet, dot implement tiep theo nen uu tien:

1. tao `core i18n structure` cho static pages
2. dua `shared header/footer labels` vao dictionaries
3. refactor `homepage` sang `ts-based page i18n`
4. sau do moi lan luot mo rong sang `about` va `projects`
