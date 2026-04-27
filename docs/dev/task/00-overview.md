---
title: "Portfolio Tasks Overview"
description: "Tổng quan 4 task cho việc hoàn thiện portfolio Duy Khiem."
publishDate: "2026-03-14T09:55:00+07:00"
updatedDate: "2026-03-14T09:55:00+07:00"
tags:
  - portfolio
  - planning
  - research
---

# Tổng quan

Thư mục `docs/` này tổng hợp 4 task đang cần xử lý cho portfolio mới:

1. Hoàn thiện phần giới thiệu bản thân.
2. Hoàn thiện phần kinh nghiệm nghề nghiệp và dự án.
3. Tìm hiểu cơ chế Table of Content ở Docs để áp dụng cho Blog.
4. Nghiên cứu pipeline chuyển bài từ Notion sang Portfolio.

## Tài liệu tương ứng

- `docs/task-1-personal-intro.md`
- `docs/task-2-career-and-projects.md`
- `docs/task-3-blog-toc-research.md`
- `docs/task-4-notion-pipeline-research.md`

## Những gì đã làm

### Index bằng CodebaseMCP

- Repo portfolio hiện tại:
  - `d-SourceCode-DuyKhiem_PORTFOLIO-DuyKhiem`
- Repo resume LaTeX:
  - `d-SourceCode-DuyKhiem_RESUME`
- Repo portfolio cũ:
  - `d-SourceCode-DuyKhiem_PORTFOLIO-DuyKhiem_PORTFOLIO`

### Nguồn dữ liệu đã đọc

- Resume LaTeX:
  - `D:\SourceCode\DuyKhiem_RESUME\Resume\26 ATS\26 ATS_FullProject.tex`
  - `D:\SourceCode\DuyKhiem_RESUME\Resume\26-2 Minimal\26-2 MinimalOptimized.tex`
  - một số mô tả project trong `D:\SourceCode\DuyKhiem_RESUME\Project\**\*.md`
- Portfolio cũ:
  - `D:\SourceCode\DuyKhiem_PORTFOLIO\DuyKhiem_PORTFOLIO\components\hero-section.tsx`
  - `D:\SourceCode\DuyKhiem_PORTFOLIO\DuyKhiem_PORTFOLIO\components\about-section.tsx`
  - `D:\SourceCode\DuyKhiem_PORTFOLIO\DuyKhiem_PORTFOLIO\components\experience-section.tsx`
  - `D:\SourceCode\DuyKhiem_PORTFOLIO\DuyKhiem_PORTFOLIO\components\projects-section.tsx`
  - `D:\SourceCode\DuyKhiem_PORTFOLIO\DuyKhiem_PORTFOLIO\components\skills-section.tsx`
- Portfolio hiện tại:
  - `D:\SourceCode\DuyKhiem_PORTFOLIO\DuyKhiem\astro.config.ts`
  - `D:\SourceCode\DuyKhiem_PORTFOLIO\DuyKhiem\src\content.config.ts`
  - `D:\SourceCode\DuyKhiem_PORTFOLIO\DuyKhiem\src\layouts\BlogPost.astro`
  - `D:\SourceCode\DuyKhiem_PORTFOLIO\DuyKhiem\src\pages\docs\[...id].astro`
  - `D:\SourceCode\DuyKhiem_PORTFOLIO\DuyKhiem\packages\pure\components\pages\TOC.astro`
  - `D:\SourceCode\DuyKhiem_PORTFOLIO\DuyKhiem\packages\pure\plugins\toc.ts`

## Tóm tắt nhanh theo task

### Task 1

Đã trích được hồ sơ nền tảng khá rõ:

- Tên: Nguyen Van Duy Khiem
- Học vấn: FPT University, Software Engineering
- Định vị phù hợp nhất hiện tại: backend-first engineer, mạnh về workflow-heavy systems, cloud-native services, distributed systems và applied AI
- Trục kỹ năng nổi bật:
  - ASP.NET Core, microservices, Kafka, SignalR, YARP
  - AWS serverless, CI/CD, Terraform, LocalStack
  - AI/computer vision, YOLO, ClearML, ONNX/OpenVINO

### Task 2

Nguồn từ portfolio cũ khá đáng tin để tái cấu trúc phần experience/project theo hướng:

- 2 kinh nghiệm chính: AWS FCAJ Program, FPT Software
- 6 đến 8 dự án mạnh nên ưu tiên:
  - SnakeAid
  - AlohaMarket
  - EzyFix
  - AWS Clickstream Analytics Platform
  - CellphoneZ
  - Claim Request System

### Task 3

Kết quả quan trọng nhất:

- Blog hiện tại thực ra đã có TOC.
- Docs dùng cùng component TOC nhưng được tổ chức sidebar tốt hơn và có thêm `DocsContents`.
- Task này nên hiểu là: tối ưu trải nghiệm TOC cho blog, không phải tạo mới từ số 0.

### Task 4

Hướng khả thi nhất cho repo hiện tại:

- Không render trực tiếp từ Notion ở runtime.
- Dùng script đồng bộ từ Notion về file cục bộ trong `src/content/blog/<slug>/index.md(x)`.
- Đồng bộ cả frontmatter, body và assets để phù hợp với schema Astro hiện tại.

## Thứ tự nên làm tiếp

1. Chốt voice và positioning cho phần giới thiệu bản thân.
2. Chốt danh sách experience và project ưu tiên xuất hiện trên homepage/blog/about.
3. Chốt spec nâng cấp TOC cho blog.
4. Thiết kế script sync Notion theo kiểu offline-first và content-first.
