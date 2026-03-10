# `WaterModal`

## Purpose

The **WaterModal** component captures a quick "watered" care entry for a single plant from the dashboard flow.

It wraps a small transactional form in `Modal` and saves data through `addCareEntry`.

## Props

| Prop                | Type                      | Required | Description                                                |
| ------------------- | ------------------------- | -------- | ---------------------------------------------------------- |
| `plantId`           | `string`                  | yes      | Target plant id used when creating the care entry.         |
| `setShowWaterModal` | `(show: boolean) => void` | yes      | Controls visibility; called with `false` on close/success. |

## Form Fields

| Field   | Type       | Required | Notes                                       |
| ------- | ---------- | -------- | ------------------------------------------- |
| `date`  | `date`     | yes      | Defaults to today; cannot be in the future. |
| `notes` | `textarea` | no       | Optional free text notes.                   |

## Behavior Notes

- Initializes `date` with `getLocalDateInputValue(new Date())`.
- Validates with Yup (`date` must be valid and not in the future).
- On submit, converts the selected date using `combineDateWithCurrentTime`.
- Before saving, computes watering metadata through `updateWateringDates(plantId, user.id, careDate)`.
- If user is not authenticated, shows error toast and exits without saving.
- Calls `addCareEntry` with:
  - `plantId`
  - authenticated `userId`
  - `careType: 'water'`
  - converted `date`
  - `notes`
  - watering metadata returned from `updateWateringDates`
- On success:
  - closes modal (`setShowWaterModal(false)`)
  - shows toast: `Plant watered` / `Care entry added successfully`
- On failure:
  - keeps modal open
  - shows toast: `Error watering plant` / `<error message>`

## Example Usage

```tsx
<WaterModal plantId="plant-123" setShowWaterModal={setShowWaterModal} />
```
