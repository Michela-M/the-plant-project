# `ScheduleListItem`

## Purpose

**ScheduleListItem** renders a compact row-style preview for upcoming care tasks. It shows image, plant identity details, and either explicit or inferred watering frequency.

## Props

| Prop                        | Type             | Required | Description                                                      |
| --------------------------- | ---------------- | -------- | ---------------------------------------------------------------- |
| `id`                        | `string`         | yes      | Plant id used when opening `WaterModal` from the options menu.   |
| `name`                      | `string`         | yes      | Plant display name.                                              |
| `species`                   | `string`         | yes      | Species/common label displayed above the name.                   |
| `wateringFrequency`         | `number \| null` | yes      | If greater than `0`, shows “Watering frequency: X days”.         |
| `inferredWateringFrequency` | `number \| null` | yes      | Used when `wateringFrequency` is missing or not positive.        |
| `imageUrl`                  | `string \| null` | no       | Plant image URL; falls back to a placeholder image when missing. |

## Rendering Behavior

- Shows **Watering frequency** when `wateringFrequency > 0`.
- Otherwise shows **Estimated watering frequency** using `inferredWateringFrequency`.
- Includes an options `IconButton` (ellipsis) for item actions.
- Options menu includes:
  - `Plant watered` which opens `WaterModal` for the current plant id.
  - `Remove from schedule` which updates the plant with `trackWatering: false`.
- On successful remove, shows toast: `Plant removed from schedule successfully`.
- On remove failure, shows an error toast with the service error message.

## Accessibility Notes

- In the current implementation, image alt text is generated internally and is not configurable through props.
- Current behavior:
  - Real image: `{name} image`.
  - Placeholder image: `No photo available for {name}`.
- To change the alt text strategy, update the component implementation.

## Example Usage

```tsx
<ScheduleListItem
  id="plant-2"
  name="Snake Plant"
  species="Sansevieria trifasciata"
  wateringFrequency={null}
  inferredWateringFrequency={14}
  imageUrl="https://example.com/snake-plant.jpg"
/>
```
