---
title: "Task 3 - Blog TOC Research"
description: "Phân tích cơ chế Table of Content ở Docs và cách áp dụng lại cho Blog."
publishDate: "2026-03-14T09:55:00+07:00"
updatedDate: "2026-03-14T09:55:00+07:00"
tags:
  - astro
  - toc
  - blog
  - docs
---

# Kết luận ngắn

Blog hiện tại đã có Table of Contents. Vấn đề không phải là “mang TOC từ Docs sang Blog”, mà là hiểu cơ chế hiện tại và quyết định có muốn nâng trải nghiệm blog lên gần giống Docs hay không.

## File đã đọc

- `astro.config.ts`
- `packages/pure/plugins/toc.ts`
- `packages/pure/components/pages/TOC.astro`
- `packages/pure/components/pages/TOCHeading.astro`
- `src/layouts/BlogPost.astro`
- `src/layouts/ContentLayout.astro`
- `src/pages/docs/[...id].astro`
- `src/pages/docs/DocsContents.astro`

# Cơ chế TOC hiện tại hoạt động như thế nào

## 1. Heading IDs được sinh ở markdown pipeline

Trong `astro.config.ts`, markdown đang dùng:

- `rehypeHeadingIds`
- custom `rehypeAutolinkHeadings`

Điều này có nghĩa:

- heading trong markdown/mdx sẽ có `id`
- heading sẽ có anchor link
- TOC có thể bám vào `slug/id` để scroll và highlight

## 2. Astro render trả về `headings`

Ở cả docs và blog, khi gọi:

- `const { Content, headings } = await render(post)`

Astro trả về danh sách heading của bài.

Đây là đầu vào chính của TOC.

## 3. `generateToc()` biến flat headings thành cây

Trong `packages/pure/plugins/toc.ts`:

- input là `MarkdownHeading[]`
- output là cây `TocItem[]`
- logic dùng stack để gắn heading con theo depth

Vì vậy:

- `h2` sẽ là node cha nếu sau nó có `h3`
- TOC có nested structure thật, không phải chỉ list phẳng

## 4. `TOC.astro` render cây và gắn hành vi client-side

`packages/pure/components/pages/TOC.astro` làm 2 việc:

- render danh sách TOC từ headings
- đăng ký custom element `toc-heading`

Script bên trong:

- query toàn bộ `article h1..h6`
- map TOC links tới heading tương ứng
- hỗ trợ smooth scroll
- theo dõi scroll để highlight mục đang đọc
- cập nhật thanh progress theo từng heading

## 5. Blog đã dùng TOC sẵn

Trong `src/layouts/BlogPost.astro`:

- nếu có headings thì render `<TOC {headings} slot='sidebar' />`

Nghĩa là blog đã có:

- sticky sidebar
- TOC
- scroll highlight

## 6. Docs dùng cùng TOC nhưng có thêm lớp điều hướng

Trong `src/pages/docs/[...id].astro`:

- sidebar gồm cả `TOC`
- và `DocsContents`

`DocsContents.astro` là navigation giữa các trang docs:

- group theo category
- highlight page hiện tại

Nó không thay thế TOC, mà bổ sung một lớp điều hướng cấp site.

# Vậy Docs đang “tốt hơn” Blog ở đâu

## Docs có 2 tầng điều hướng

- Tầng 1: TOC trong bài hiện tại
- Tầng 2: danh sách tài liệu toàn bộ docs

Blog hiện tại mới có tầng 1.

## Docs có tinh chỉnh layout cho sidebar rõ hơn

`src/pages/docs/[...id].astro` có CSS riêng cho màn hình lớn:

- cố định thêm khối docs navigation
- quản lý vùng scroll trong sidebar tốt hơn

Blog hiện tại dựa nhiều hơn vào layout chung.

# Điều này có ý nghĩa gì cho task

## Nếu mục tiêu là “Blog phải có TOC”

Thì đã xong về mặt kỹ thuật.

## Nếu mục tiêu là “Blog có trải nghiệm TOC tốt như Docs”

Thì nên làm theo hướng sau.

# Đề xuất áp dụng cho Blog

## Option A - Giữ nguyên logic, chỉ polish UX

Đây là hướng ít rủi ro nhất.

Làm:

- giới hạn TOC còn `h2` và `h3`
- ẩn `h1` khỏi TOC nếu cần
- chỉnh spacing và typography cho sidebar blog
- kiểm tra mobile sidebar dễ mở hơn

Phù hợp khi:

- muốn ship nhanh
- không muốn đụng sâu vào theme

## Option B - Thêm “BlogContents” giống `DocsContents`

Ý tưởng:

- ngoài TOC của bài hiện tại, sidebar blog có thêm khối phụ:
  - related posts
  - series posts
  - recent posts
  - cùng tag

Phù hợp khi:

- blog sẽ có nhiều bài
- muốn sidebar có giá trị điều hướng giống docs

## Option C - Tách TOC thành variant cho docs/blog

Ý tưởng:

- dùng cùng engine `generateToc`
- nhưng tách presentation:
  - `DocsTOC`
  - `BlogTOC`

Phù hợp khi:

- muốn blog có visual language riêng
- muốn đơn giản hóa TOC cho blog mà không ảnh hưởng docs

# Khuyến nghị của mình

Nên chọn `Option A` trước, sau đó mới cân nhắc `Option B`.

Lý do:

- repo hiện tại đã có TOC chạy được
- vấn đề lớn nhất là experience và information density, không phải thiếu tính năng
- nếu làm thêm khối điều hướng kiểu docs quá sớm, blog dễ thành nặng và rối

# Checklist kỹ thuật để áp dụng cho blog

## Kiểm tra dữ liệu đầu vào

- bảo đảm blog `.md` và `.mdx` có heading hierarchy chuẩn
- tránh nhảy từ `h2` sang `h4` nếu không cần

## Kiểm tra output TOC

- có cần show `h1` không
- có cần giới hạn depth không
- có cần bỏ heading rỗng/heading đặc biệt không

## Kiểm tra UX

- sticky sidebar trên desktop
- sidebar toggle trên mobile
- smooth scroll không gây lệch do fixed header
- active state dễ đọc

# Kết luận cuối

Task 3 không nên được hiểu là “port TOC từ docs sang blog” vì blog đã có TOC. Nên hiểu là:

- audit cơ chế hiện tại
- xác định khoảng cách UX giữa docs và blog
- nâng blog sidebar/TOC theo mức độ cần thiết

Nếu triển khai, mình sẽ ưu tiên:

1. giới hạn depth TOC cho blog
2. tối ưu spacing và sticky behavior
3. chỉ thêm điều hướng phụ khi số lượng bài blog đã đủ lớn
