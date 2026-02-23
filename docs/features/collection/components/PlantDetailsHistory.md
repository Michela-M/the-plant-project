# `PlantDetailsHistory`

## Purpose

The **PlantDetailsHistory** component fetches and displays a plant’s care-entry timeline.
It renders loading and empty states, groups entries by calendar date, and shows a care-type-specific icon and label for each entry.

## Props

| Prop      | Type     | Required | Description                                         |
| --------- | -------- | -------- | --------------------------------------------------- |
| `plantId` | `string` | yes      | Plant document ID used to fetch care history items. |

## Behavior Notes

- Reads data from `getCareHistory(plantId, userId)` on mount and when `plantId` or `user.id` changes.
- Shows `Spinner` while loading.
- Shows an empty state message when no care entries exist.
- Groups entries by `entry.date.toLocaleDateString()` so items from the same day render under one date heading.
- Maps care types to labels and icons:
  - `water` → `Plant watered`
  - `fertilize` → `Plant fertilized`
  - `repot` → `Plant repotted`
  - `other` → `Other` (appends `: {otherCareType}` when provided)
- Shows notes only when `entry.notes` is non-empty.
- Uses `showError` toast feedback if history fetch fails.

## Example Usage

```jsx
<PlantDetailsHistory plantId="plant-123" />
```
