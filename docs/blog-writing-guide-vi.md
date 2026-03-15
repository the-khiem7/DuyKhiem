# Hướng dẫn viết bài Blog mới

## Giới thiệu

Tài liệu này hướng dẫn cách viết và xuất bản bài blog mới cho dự án này. Dự án sử dụng Astro framework với hỗ trợ Markdown và MDX.

## Cấu trúc thư mục

```
src/content/blog/
├── 3d-rendering/
│   ├── index.md
│   ├── thumbnail.jpg
│   └── other-images.jpg
├── using-mdx.mdx
└── your-post-slug/
    ├── index.md (hoặc index.mdx)
    └── thumbnail.jpg
```

### Quy tắc đặt tên slug

- Sử dụng chữ thường và dấu gạch nối (kebab-case)
- Giữ ngắn gọn và có ý nghĩa
- Tránh ngày tháng trong slug trừ khi được yêu cầu đặc biệt

**Ví dụ tốt:**
- `getting-started-with-astro`
- `web-development-tips`
- `my-first-post`

**Ví dụ không tốt:**
- `2025-03-15-my-post`
- `My_First_Post`
- `very-long-slug-name-that-is-hard-to-read`

## Frontmatter (Metadata)

Frontmatter là phần metadata ở đầu file, được đặt giữa hai dòng `---`.

### Các trường bắt buộc

```yaml
---
title: 'Tiêu đề bài viết'          # Tối đa 60 ký tự
description: 'Mô tả ngắn gọn'     # Tối đa 160 ký tự
publishDate: '2025-03-15T08:00:00Z'  # Ngày xuất bản (ISO 8601)
---
```

### Các trường tùy chọn

```yaml
---
title: 'Tiêu đề bài viết'
description: 'Mô tả ngắn gọn'
publishDate: '2025-03-15T08:00:00Z'
updatedDate: '2025-03-20T08:00:00Z'  # Ngày cập nhật
tags:
  - astro
  - tutorial
  - web-development
language: 'Vietnamese'              # Ngôn ngữ bài viết
draft: false                         # true = bản nháp, không hiển thị
comment: true                        # true = cho phép bình luận
heroImage: {                         # Ảnh bìa
  src: './thumbnail.jpg',
  alt: 'Mô tả ảnh',
  color: '#B4C6DA'                  # Màu nền khi ảnh chưa tải
}
---
```

### Template hoàn chỉnh

```yaml
---
title: 'Tiêu đề bài viết của bạn'
description: 'Một câu mô tả ngắn gọn dưới 160 ký tự.'
publishDate: '2025-03-15T08:00:00Z'
updatedDate: '2025-03-15T08:00:00Z'
tags:
  - astro
  - mdx
heroImage: { src: './thumbnail.jpg', alt: 'Mô tả ảnh', color: '#B4C6DA' }
language: 'Vietnamese'
draft: false
comment: true
---
```

## Markdown vs MDX

### Khi nào dùng Markdown (.md)?

- Nội dung chủ yếu là văn bản
- Không cần component UI tương tác
- Bài viết đơn giản, chỉ cần định dạng cơ bản

### Khi nào dùng MDX (.mdx)?

- Cần sử dụng component UI (`<Aside>`, `<Tabs>`, v.v.)
- Cần các khối trình bày tương tác
- Cần nhúng JavaScript/JSX

**Lưu ý:** Không nên dùng MDX cho bài viết chỉ có văn bản thuần.

## Tính năng Markdown có sẵn

### Hỗ trợ toán học

```markdown
Công thức Euler: $e^{i\pi} + 1 = 0$

Hoặc dạng block:

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

### Đánh dấu code

```markdown
// [!code ++]  // Thêm dòng mới
// [!code --]  // Xóa dòng
// [!code highlight]  // Highlight dòng
```

### Syntax highlighting

```markdown
```typescript
function greet(name: string): string {
  return `Hello, ${name}!`;
}
```
```

## Components có sẵn

### astro-pure/user

#### Aside - Thông báo

```mdx
import { Aside } from 'astro-pure/user'

<Aside type='tip' title='Mẹo nhanh'>
  Giữ phần này ngắn gọn và có thể thực hiện ngay.
</Aside>

<Aside type='note' title='Lưu ý'>
  Đây là thông tin quan trọng cần nhớ.
</Aside>

<Aside type='caution' title='Cảnh báo'>
  Hãy cẩn thận khi thực hiện hành động này.
</Aside>

<Aside type='danger' title='Nguy hiểm'>
  Hành động này có thể gây hậu quả nghiêm trọng.
</Aside>
```

#### Tabs - Tab chuyển đổi

```mdx
import { Tabs, TabItem } from 'astro-pure/user'

<Tabs syncKey='pkg-manager'>
  <TabItem label='Bun'>bun dev</TabItem>
  <TabItem label='npm'>npm run dev</TabItem>
  <TabItem label='pnpm'>pnpm dev</TabItem>
</Tabs>
```

#### Collapse - Mở rộng nội dung

```mdx
import { Collapse } from 'astro-pure/user'

<Collapse title='Xem chi tiết'>
  <div slot='before' class='text-sm text-muted-foreground'>
    Thông tin dẫn dắt tùy chọn
  </div>
  <p>Nội dung mở rộng ở đây.</p>
</Collapse>
```

#### Steps - Các bước thực hiện

```mdx
import { Steps } from 'astro-pure/user'

<Steps>
1. Bước đầu tiên
2. Bước thứ hai
3. Bước thứ ba
</Steps>
```

#### Button - Nút bấm

```mdx
import { Button } from 'astro-pure/user'

<Button as='a' href='/blog' title='Đọc thêm' variant='ahead' />
<Button as='div' title='Quay lại' variant='back' />
<Button as='button' title='Xác nhận' variant='button' />
```

#### Icon - Biểu tượng

```mdx
import { Icon } from 'astro-pure/user'

<Icon name='heart' label='Yêu thích' color='red' size='24' />
```

### astro-pure/advanced

#### LinkPreview - Xem trước link

```mdx
import { LinkPreview } from 'astro-pure/advanced'

<LinkPreview href='https://docs.astro.build/' hideMedia />
```

#### QRCode - Mã QR

```mdx
import { QRCode } from 'astro-pure/advanced'

<QRCode content='https://example.com' class='inline-flex max-w-44 p-3 border rounded-lg' />
```

## Quy trình viết bài

### Bước 1: Tạo thư mục bài viết

```bash
# Tạo thư mục mới
mkdir src/content/blog/your-post-slug
```

### Bước 2: Tạo file nội dung

```bash
# Tạo file .md hoặc .mdx
touch src/content/blog/your-post-slug/index.md
```

### Bước 3: Thêm ảnh thumbnail

Đặt ảnh thumbnail trong cùng thư mục với bài viết:
```
src/content/blog/your-post-slug/
├── index.md
└── thumbnail.jpg
```

### Bước 4: Viết frontmatter

Sử dụng template ở trên để điền metadata.

### Bước 5: Viết nội dung

- Sử dụng heading hierarchy rõ ràng (`##`, `###`)
- Giữ đoạn văn ngắn gọn
- Sử dụng code blocks với ngôn ngữ rõ ràng
- Thêm hình ảnh có ý nghĩa với alt text

### Bước 6: Kiểm tra trước khi xuất bản

- [ ] Frontmatter hợp lệ và đúng schema
- [ ] `title` ≤ 60 ký tự
- [ ] `description` ≤ 160 ký tự
- [ ] Không có frontmatter field không hợp lệ
- [ ] Markdown/MDX biên dịch thành công
- [ ] Tất cả đường dẫn ảnh và link hợp lệ
- [ ] Không có placeholder (`TODO`, `lorem ipsum`)
- [ ] Tags tập trung (thường 2-6 tags)

## Ví dụ bài viết hoàn chỉnh

### Ví dụ Markdown đơn giản

```markdown
---
title: 'Bắt đầu với Astro'
description: 'Hướng dẫn nhanh để tạo website đầu tiên với Astro framework.'
publishDate: '2025-03-15T08:00:00Z'
tags:
  - astro
  - tutorial
language: 'Vietnamese'
---

Astro là một framework web hiện đại giúp bạn xây dựng website nhanh hơn.

## Cài đặt Astro

```bash
npm create astro@latest my-astro-project
cd my-astro-project
npm install
npm run dev
```

## Tại sao chọn Astro?

- **Nhanh:** Tối ưu hóa performance mặc định
- **Dễ học:** Cú pháp thân thiện
- **Linh hoạt:** Hỗ trợ nhiều framework UI

## Kết luận

Astro là lựa chọn tuyệt vời cho các dự án web hiện đại.
```

### Ví dụ MDX với components

```mdx
---
title: 'Sử dụng MDX trong Astro'
description: 'Tìm hiểu cách sử dụng MDX để tạo nội dung tương tác.'
publishDate: '2025-03-15T08:00:00Z'
tags:
  - astro
  - mdx
language: 'Vietnamese'
---

MDX cho phép bạn nhúng React components vào Markdown.

import { Aside } from 'astro-pure/user'
import { Tabs, TabItem } from 'astro-pure/user'

<Aside type='tip' title='Mẹo'>
  MDX rất hữu ích cho các bài hướng dẫn kỹ thuật.
</Aside>

## Cài đặt các package manager khác nhau

<Tabs syncKey='pkg-manager'>
  <TabItem label='Bun'>
    ```bash
    bun install
    bun run dev
    ```
  </TabItem>
  <TabItem label='npm'>
    ```bash
    npm install
    npm run dev
    ```
  </TabItem>
  <TabItem label='pnpm'>
    ```bash
    pnpm install
    pnpm dev
    ```
  </TabItem>
</Tabs>

## Kết luận

MDX mở rộng khả năng của Markdown, giúp bạn tạo nội dung phong phú hơn.
```

## Quy tắc chất lượng nội dung

### Viết tiêu đề

- Ngắn gọn, rõ ràng, hấp dẫn
- Tối đa 60 ký tự
- Tránh từ khóa trùng lặp

### Viết mô tả

- Một câu duy nhất, tóm tắt nội dung chính
- Tối đa 160 ký tự
- Nên chứa từ khóa quan trọng

### Viết nội dung

- Sử dụng heading hierarchy hợp lý
- Đoạn văn ngắn (2-4 câu)
- Tránh văn bản lặp lại
- Sử dụng ví dụ cụ thể
- Thêm link liên quan khi cần thiết

### Sử dụng hình ảnh

- Ưu tiên ảnh local trong thư mục bài viết
- Đường dẫn tương đối: `./image.jpg`
- Luôn thêm alt text có ý nghĩa
- Tối ưu kích thước ảnh

### Tags

- 2-6 tags là lý tưởng
- Sử dụng chữ thường
- Tags sẽ tự động được lowercased và deduplicated

## Lưu ý quan trọng

### Không được làm

- Không sửa `src/content.config.ts` khi chỉ viết bài
- Không thêm frontmatter field không được hỗ trợ
- Không sửa theme components trừ khi được yêu cầu
- Không phụ thuộc vào `src/content/docs` cho việc viết blog thông thường

### Nên làm

- Kiểm tra source code trong `packages/pure/components/**` nếu component hoạt động khác với tài liệu
- Cập nhật tài liệu này nếu có thay đổi
- Luôn kiểm tra trước khi xuất bản

## Tài liệu tham khảo

- [Astro Documentation](https://docs.astro.build/)
- [MDX Documentation](https://mdxjs.com/)
- [AGENTS.md](../../AGENTS.md) - Tài liệu chi tiết cho AI agents

## Hỗ trợ

Nếu gặp vấn đề khi viết bài blog:

1. Kiểm tra lại frontmatter
2. Xác nhận file path đúng
3. Đảm bảo tất cả assets tồn tại
4. Xem log error từ Astro dev server