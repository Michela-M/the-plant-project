# `ScheduleCard`

## Purpose

**ScheduleCard** renders a care-focused card for plants that need attention today (including overdue plants). It displays species/name, image, last watering date, and either a configured watering frequency or an inferred fallback frequency.

## Props

| Prop                        | Type             | Required | Description                                                                         |
| --------------------------- | ---------------- | -------- | ----------------------------------------------------------------------------------- |
| `id`                        | `string`         | yes      | Plant id passed to action modals (`WaterModal`, `SnoozeModal`).                     |
| `name`                      | `string`         | yes      | Plant display name.                                                                 |
| `species`                   | `string`         | yes      | Species label shown above the name.                                                 |
| `lastWateredDate`           | `Date \| null`   | yes      | Last watering date; rendered as relative text using `formatRelativeDate`, or `N/A`. |
| `wateringFrequency`         | `number \| null` | yes      | If greater than `0`, shows “Watering frequency: X days”.                            |
| `inferredWateringFrequency` | `number \| null` | yes      | Used when `wateringFrequency` is missing or not positive.                           |
| `imageUrl`                  | `string \| null` | no       | Plant image URL; falls back to a placeholder image when missing.                    |

## Rendering Behavior

- Shows **Last watering** with relative date text when `lastWateredDate` exists.
- Shows **Watering frequency** when `wateringFrequency > 0`.
- Otherwise shows **Estimated watering frequency** using `inferredWateringFrequency`.
- Renders `Watered` and `Snooze` action buttons.
- Clicking `Watered` opens `WaterModal` for the current plant id.
- Clicking `Snooze` opens `SnoozeModal` for the current plant id.

## Accessibility Notes

- In the current implementation, image alt text is generated internally and is not configurable through props.
- Current behavior:
  - Real image: `{name} image`.
  - Placeholder image: `No photo available for {name}`.
- To change the alt text strategy, update the component implementation.

## Example Usage

```tsx
<ScheduleCard
  id="plant-123"
  name="Monstera"
  species="Monstera deliciosa"
  lastWateredDate={new Date('2026-03-01T10:00:00Z')}
  wateringFrequency={7}
  inferredWateringFrequency={8}
  imageUrl="https://example.com/monstera.jpg"
/>
```
