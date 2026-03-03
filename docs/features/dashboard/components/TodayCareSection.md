# `TodayCareSection`

## Purpose

**TodayCareSection** renders the dashboard section for plants that need care today (including overdue plants already partitioned upstream). It maps plants into `ScheduleCard` components.

## Props

| Prop     | Type                                                                                                                                                                                              | Required | Description                                    |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------------------------------------------- |
| `plants` | `Array<{ id: string; name: string; species: string; wateringFrequency: number \| null; inferredWateringFrequency?: number \| null; lastWateredDate?: Date \| null; imageUrl?: string \| null; }>` | yes      | List of plants to render in the today section. |

## Rendering Behavior

- Renders a horizontal list of `ScheduleCard` items when `plants.length > 0`.
- Passes through plant identity and watering data to each card.
- Normalizes optional date/frequency values to `null` before passing them down.

## Example Usage

```tsx
<TodayCareSection
  plants={[
    {
      id: 'plant-1',
      name: 'Monstera',
      species: 'Monstera deliciosa',
      wateringFrequency: 7,
      inferredWateringFrequency: 8,
      lastWateredDate: new Date('2026-03-01T10:00:00Z'),
      imageUrl: 'https://example.com/monstera.jpg',
    },
  ]}
/>
```
