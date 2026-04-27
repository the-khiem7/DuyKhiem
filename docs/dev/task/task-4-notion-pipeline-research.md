---
title: "Task 4 - Notion Pipeline Research"
description: "Nghiên cứu pipeline chuyển bài từ Notion sang Astro portfolio hiện tại."
publishDate: "2026-03-14T09:55:00+07:00"
updatedDate: "2026-03-14T09:55:00+07:00"
tags:
  - notion
  - astro
  - content
  - pipeline
---

# Mục tiêu

Tìm hướng build pipeline chuyển bài từ Notion sang portfolio Astro hiện tại theo cách bền vững, phù hợp schema content và trải nghiệm authoring của repo này.

## Bối cảnh repo hiện tại

### Tech constraints đã xác nhận

- Repo dùng `Astro 5.16.6`
- Blog đang đọc nội dung cục bộ từ:
  - `src/content/blog`
- Loader hiện tại trong `src/content.config.ts` là:
  - `glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' })`
- Frontmatter blog yêu cầu:
  - `title`
  - `description`
  - `publishDate`
- Hỗ trợ local image qua `image()` schema helper

### Ý nghĩa thực tế

Repo này đang được thiết kế theo mô hình:

- content local-first
- build-time validation
- image local-relative

Cho nên pipeline tốt nhất là:

- Notion là nơi viết
- repo Astro là nơi publish

Không nên để Notion trở thành content source runtime trực tiếp ở phiên bản hiện tại.

# Nghiên cứu từ tài liệu chính thức

## Notion API

Theo tài liệu Notion:

- page content được đọc qua API children của block/page
- response phân trang, tối đa `100` item mỗi lần
- block có `has_children` phải được gọi đệ quy để lấy đủ nội dung
- với file upload, Notion có object `file_upload`; sau khi status là `uploaded`, file có thể được attach vào blocks/pages

Điều này dẫn tới 2 kết luận:

1. Sync content từ Notion không thể làm kiểu gọi một lần rồi xong.
2. Image/file handling phải có chiến lược riêng, không thể chỉ convert text.

## Astro content collections

Theo Astro docs:

- content collections là cách chuẩn để quản lý markdown/mdx local
- body của entry là markdown/mdx raw
- schema có thể validate frontmatter chặt
- local images dùng `image()` helper

Điều này khớp rất tốt với mô hình:

- sync từ Notion về file local trong `src/content/blog/<slug>/index.md` hoặc `index.mdx`

# Các phương án kiến trúc

## Option 1 - Runtime fetch từ Notion

### Cách làm

- Page blog render trực tiếp từ Notion API
- hoặc build time fetch remote rồi render tạm

### Ưu điểm

- không cần lưu content trong repo
- thay đổi ở Notion có thể phản ánh nhanh

### Nhược điểm

- lệch kiến trúc repo hiện tại
- khó tương thích schema content hiện có
- image handling phức tạp
- tăng coupling với Notion API
- khó review nội dung qua git

### Kết luận

Không phải lựa chọn nên ưu tiên.

## Option 2 - One-way sync: Notion -> local Markdown/MDX

### Cách làm

- viết bài trong Notion
- chạy script sync
- script tạo folder:
  - `src/content/blog/<slug>/index.md`
  - hoặc `index.mdx`
- tải asset về local cùng folder bài
- map metadata Notion sang frontmatter Astro

### Ưu điểm

- phù hợp tuyệt đối với repo hiện tại
- nội dung vào git, dễ review
- schema Astro validate ngay khi build
- asset local tương thích `heroImage.src: './thumbnail.jpg'`

### Nhược điểm

- cần một bước sync riêng
- cần mapping block Notion -> markdown/mdx

### Kết luận

Đây là lựa chọn tốt nhất.

## Option 3 - Hybrid sync với manifest/cache

### Cách làm

- vẫn sync về local file
- thêm manifest JSON lưu:
  - notion_page_id
  - last_edited_time
  - slug
  - exported assets

### Ưu điểm

- sync incremental tốt hơn
- tránh export lại toàn bộ
- dễ build CI automation

### Nhược điểm

- phức tạp hơn option 2

### Kết luận

Nên làm sau khi option 2 chạy ổn.

# Đề xuất pipeline cụ thể

## Recommended architecture

`Notion database/page -> sync script -> local blog folder -> Astro build`

## Dữ liệu Notion nên có

Mỗi bài nên có các field:

- `Title`
- `Slug`
- `Description`
- `PublishDate`
- `UpdatedDate`
- `Tags`
- `Language`
- `Draft`
- `Comment`
- `HeroImage`
- `Status`

## Mapping sang frontmatter Astro

- `Title` -> `title`
- `Description` -> `description`
- `PublishDate` -> `publishDate`
- `UpdatedDate` -> `updatedDate`
- `Tags` -> `tags`
- `Language` -> `language`
- `Draft` -> `draft`
- `Comment` -> `comment`
- `HeroImage` -> `heroImage.src`

# Những phần khó nhất cần giải quyết

## 1. Recursive block traversal

Notion page không trả về full tree trong một request.

Cần:

- paginate
- recurse children khi `has_children = true`
- tránh dính rate limit

## 2. Markdown/MDX conversion

Không phải block nào của Notion cũng map đẹp sang Markdown thuần.

Ví dụ:

- callout
- toggle
- columns
- synced block
- bookmark/embed

Vì repo này hỗ trợ MDX và có component custom, nên cần nguyên tắc:

- block đơn giản -> Markdown
- block giàu UI -> MDX

## 3. Asset handling

Repo blog này ưu tiên asset local cạnh bài viết.

Vì vậy nên:

- download image về thư mục bài
- rename ổn định theo slug hoặc thứ tự
- rewrite đường dẫn trong markdown/mdx về local relative path

## 4. Frontmatter validation

Script phải sinh frontmatter đúng schema hiện tại.

Nếu thiếu:

- `title`
- `description`
- `publishDate`

thì script nên fail sớm.

# Thiết kế script gợi ý

## Đầu vào

- `NOTION_TOKEN`
- `NOTION_DATABASE_ID` hoặc `NOTION_PAGE_ID`
- mode:
  - `single-page`
  - `database-batch`

## Đầu ra

- `src/content/blog/<slug>/index.md`
- hoặc `src/content/blog/<slug>/index.mdx`
- assets local cùng thư mục
- manifest sync, ví dụ:
  - `.cache/notion-sync-manifest.json`

## Các bước

1. Lấy metadata bài từ page/database.
2. Lấy block tree đầy đủ bằng recursive fetch.
3. Convert block tree sang Markdown/MDX AST hoặc string.
4. Tải assets về local.
5. Sinh frontmatter theo schema.
6. Ghi file vào `src/content/blog/<slug>/`.
7. Chạy validate build.

# Quy tắc authoring nên chốt từ đầu

## Trong Notion

- dùng heading hierarchy chuẩn
- dùng block đơn giản càng nhiều càng tốt
- hạn chế layout nhiều cột nếu muốn export đẹp
- nếu cần callout/tabs/collapse, phải định nghĩa quy tắc mapping sang MDX

## Trong Astro

- `.md` cho bài text-first
- `.mdx` khi cần component như `Aside`, `Tabs`, `Collapse`

# Công cụ và thư viện

## Có thể dùng

- Notion official API để lấy page blocks
- custom converter riêng theo schema repo

## Có thể tham khảo

- `notion-to-md`

Lưu ý:

- đây là thư viện phổ biến nhưng không phải source of truth
- vẫn cần adapter riêng để khớp frontmatter, asset local, và MDX conventions của repo này

# Khuyến nghị thực tế

## Phase 1

Làm một script sync đơn giản cho:

- 1 page Notion
- text blocks
- headings
- lists
- code blocks
- images cơ bản

Đầu ra:

- `.md`
- local assets

## Phase 2

Mở rộng cho:

- `.mdx`
- callout -> `Aside`
- toggle -> `Collapse`
- tab patterns -> `Tabs` và `TabItem`

## Phase 3

Thêm CI hoặc command nội bộ:

- `bun notion:sync`
- `bun notion:sync --slug my-post`

# Kết luận

Pipeline phù hợp nhất cho portfolio hiện tại là `Notion -> local Markdown/MDX sync`, không phải runtime rendering. Nó khớp với:

- Astro content collections hiện có
- schema frontmatter hiện có
- image handling local của repo
- workflow review bằng git

Nếu triển khai, mình khuyến nghị bắt đầu bằng phiên bản nhỏ nhưng chắc:

- 1 page
- 1 script
- 1 slug
- 1 lần export ra `src/content/blog/<slug>/index.md`

Sau đó mới nâng dần sang batch sync và MDX-rich conversion.

# Nguồn tham khảo

- Notion: Working with page content
  - https://developers.notion.com/guides/data-apis/working-with-page-content
- Notion: File Upload
  - https://developers.notion.com/reference/file-upload
- Astro: Content Collections API Reference
  - https://docs.astro.build/en/reference/modules/astro-content/
