@AGENTS.md

# Shared Memories App — Schema & Feature Spec

## `memories` table
- `id`
- `title` (text)
- `description` (text, plain text — no markdown)
- `memory_date` (date)
- `date_precision` (`day` | `month` | `year`) — lets a memory be recorded as "March 2024" without faking a day. Use this to drive both display formatting and chronological sort/grouping.
- `created_by`
- `images` (JSON array of URLs) — empty array for now; upload support is a later phase, but the column is array-shaped from the start so multiple photos per memory don't require a migration.
- `created_at`

Note for future `users` table if added for session mapping: keep flat, no premature normalization (tags, people, locations) per project constraints above.

## CRUD behavior
- Create, edit, delete via Server Actions (no REST layer).
- Edit: all fields editable.
- Delete: hard delete — no soft-delete/`deleted_at` column.

## Primary UI
- Vertical chronological timeline as the main browsing view (not horizontal scroll, not calendar/heatmap).
- Group/label entries using `date_precision` (e.g. show "March 2024" for month-precision entries, "2024" for year-precision).
- Image rendering in timeline cards should be built to accept the `images` array even before upload UI exists.
