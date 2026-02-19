# `PlantDetailsSchedule`

## Purpose

The **PlantDetailsSchedule** component displays watering-related information for a plant. It supports an empty state and conditionally shows last watered, next watering, and watering frequency details.

## Props

| Prop    | Type   | Required | Description                                      |
| ------- | ------ | -------- | ------------------------------------------------ |
| `plant` | object | yes      | Plant watering data used to render the schedule. |

### `plant` shape

| Field               | Type           | Required | Description                               |
| ------------------- | -------------- | -------- | ----------------------------------------- |
| `wateringFrequency` | `number`       | no       | Interval in days between watering events. |
| `lastWatered`       | `Date \| null` | no       | Date of the last watering event.          |

## Behavior Notes

- If both `lastWatered` and a valid `wateringFrequency` are missing, an empty state message is shown.
- `Last watered` appears only when `lastWatered` exists.
- `Next watering` appears only when both values exist:
  - future date → relative date from `formatRelativeDate`
  - past/now date → `Due now`
- `Watering frequency` appears only when `wateringFrequency > 0`.

## Example Usage

```jsx
<PlantDetailsSchedule
  plant={{
    lastWatered: new Date('2026-02-14'),
    wateringFrequency: 7,
  }}
/>
```
