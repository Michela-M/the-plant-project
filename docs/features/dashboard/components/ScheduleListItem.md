# `ScheduleListItem`

## Purpose

**ScheduleListItem** renders a compact row-style preview for upcoming care tasks. It shows image, plant identity details, and either explicit or inferred watering frequency.

## Props

| Prop                        | Type             | Required | Description                                                      |
| --------------------------- | ---------------- | -------- | ---------------------------------------------------------------- |
| `name`                      | `string`         | yes      | Plant display name.                                              |
| `species`                   | `string`         | yes      | Species/common label displayed above the name.                   |
| `wateringFrequency`         | `number \| null` | yes      | If greater than `0`, shows “Watering frequency: X days”.         |
| `inferredWateringFrequency` | `number \| null` | yes      | Used when `wateringFrequency` is missing or not positive.        |
| `imageUrl`                  | `string \| null` | no       | Plant image URL; falls back to a placeholder image when missing. |

## Rendering Behavior

- Shows **Watering frequency** when `wateringFrequency > 0`.
- Otherwise shows **Estimated watering frequency** using `inferredWateringFrequency`.
- Includes an options `IconButton` (ellipsis) for item actions.

## Example Usage

```tsx
<ScheduleListItem
  name="Snake Plant"
  species="Sansevieria trifasciata"
  wateringFrequency={null}
  inferredWateringFrequency={14}
  imageUrl="https://example.com/snake-plant.jpg"
/>
```
