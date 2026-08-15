@AGENTS.md

# Shared Memories App — Schema & Feature Spec

## `memories` table
- `id`
- `title` (text)
- `description` (text, plain text — no markdown)
- `memory_date` (date)
- `date_precision` (`day` | `month` | `year`) — lets a memory be recorded as "March 2024" without faking a day. Use this to drive both display formatting and chronological sort/grouping.
- `created_by`
- `images` (JSON array of https URLs, max 3 per memory) — pasted image links (e.g. Google Photos), not uploads to our own storage. Validated server-side in `parseImages` (`src/app/actions.ts`).
- `links` (JSON array of `{ url, label? }`, max 10 per memory) — arbitrary related links (http/https), validated server-side in `parseLinks` (`src/app/actions.ts`). `label` is optional; UI falls back to showing the bare URL.
- `created_at`

Note for future `users` table if added for session mapping: keep flat, no premature normalization (tags, people, locations) per project constraints above.

## CRUD behavior
- Create, edit, delete via Server Actions (no REST layer): `createMemory`, `updateMemory`, `deleteMemory` in `src/app/actions.ts`.
- Edit: all fields editable.
- Delete: hard delete — no soft-delete/`deleted_at` column.

## Primary UI
- Vertical chronological timeline as the main browsing view (not horizontal scroll, not calendar/heatmap), grouped by year with a year filter (`YearFilter`).
- Group/label entries using `date_precision` (e.g. show "March 2024" for month-precision entries, "2024" for year-precision).
- `MemoryCard` (list view) and `MemoryDetail` (single-memory view, with inline edit/delete) both render the `images` array as thumbnails and the `links` array as pill-style anchors. `MemoryCard`'s links row sits outside its `Link` wrapper (not nested inside it) to avoid nested `<a>` tags.
