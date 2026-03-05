# `UpcomingCareSection`

## Purpose

**UpcomingCareSection** renders upcoming care tasks grouped by `nextWateringDate`. It displays a section heading, groups list items by day, and renders each plant as a `ScheduleListItem`.

## Props

| Prop     | Type                                                                                                                                                                                                                              | Required | Description                                  |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | -------------------------------------------- |
| `plants` | `Array<{ id: string; name: string; species: string; nextWateringDate: Date \| null; wateringFrequency: number \| null; inferredWateringFrequency?: number \| null; lastWateredDate?: Date \| null; imageUrl?: string \| null; }>` | yes      | List of upcoming plants to group and render. |

## Rendering Behavior

- Always renders the title **“Upcoming Care”**.
- Groups items by calendar day using a stable `YYYY-MM-DD` key derived from `nextWateringDate`.
- Displays one heading per date in the format: `Weekday, D Mon (relative)` (for example: `Tuesday, 3 Mar (tomorrow)`).
- Skips plants where `nextWateringDate` is `null`.
- Renders **“No upcoming care.”** when no grouped entries exist.
- Preserves incoming order of date groups based on the first occurrence of each date key.

## Notes

- Relative date text in headings is produced with `formatRelativeDate`.
- `wateringFrequency` is passed to `ScheduleListItem` and falls back to `0` when missing.
- `inferredWateringFrequency` is passed to `ScheduleListItem` and falls back to `null` when missing.

## Example Usage

```tsx
<UpcomingCareSection
  plants={[
    {
      id: 'plant-2',
      name: 'Snake Plant',
      species: 'Sansevieria trifasciata',
      nextWateringDate: new Date('2026-03-03T09:00:00Z'),
      wateringFrequency: null,
      inferredWateringFrequency: 14,
      imageUrl: null,
    },
  ]}
/>
```
