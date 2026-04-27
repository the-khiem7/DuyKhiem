# Coursera Extraction Subagent Guideline

Use this guideline when delegating Coursera extraction work to subagents.

## Current Extraction State

- Completed batch: programs 7-9.
- Successful subagent: Descartes.
- Applied files:
  - `src/content/blog/google-certifications-course-list/en.md`
  - `src/content/blog/google-certifications-course-list/vi.md`
- Scratch file:
  - `docs/superpowers/tmp/google-certifications-coursera-extraction.json`
- Current scratch contents:
  - 23 verified courses.
  - 0 unresolved items.
  - Program IDs present: 7, 8, 9.
- Remaining work:
  - Programs 1-6 need revalidation.
  - Programs 10-12 need revalidation.
  - Do not assume old Markdown details are source truth for remaining programs.

## What Worked

The successful Descartes batch had these properties:

- One bounded course group: programs 7-9 only.
- Direct `/learn/` URLs were provided up front.
- The exact extraction script and output schema were included in the prompt.
- The agent was told not to edit files.
- The final answer was machine-readable JSON with `verified` and `unresolved`.
- No open-ended search was needed.

## Delegation Rules

- Prefer 15-25 direct course URLs per subagent.
- Do not ask a subagent to discover many unknown slugs.
- Give every course as `{ program, number, hours, title, url }`.
- Require `agent-browser skills get core` before browser commands.
- Require one browser session per subagent batch.
- Require compact JSON output only.
- Require unresolved items to include a short reason.
- Close or interrupt agents that do not produce useful output within one waiting cycle.

## Prompt Contract

Every extraction prompt must include:

- Scope: exact programs and course count.
- Write policy: `Do not edit files.`
- Source policy: preserve Coursera wording and tag order.
- Failure policy: unresolved instead of guessing.
- Output schema:

```json
{
  "verified": [
    {
      "program": 7,
      "number": 1,
      "hours": 12,
      "title": "Course title from Coursera",
      "url": "https://www.coursera.org/learn/course-slug",
      "learn": [],
      "skills": [],
      "tools": []
    }
  ],
  "unresolved": []
}
```

## Anti-Patterns

- Do not delegate all 71 courses to one agent.
- Do not combine extraction and Markdown editing in the same subagent.
- Do not let subagents infer course URLs from certificate pages unless the batch is explicitly a URL-discovery batch.
- Do not ask subagents to summarize, translate, or rewrite Coursera text.
- Do not wait repeatedly on stalled agents; harvest completed output and continue with verified data only.
