# `CareModal`

## Purpose

The **CareModal** component captures and submits a new plant care entry. It supports two modes:

- global mode (no `plantId`): user selects a plant from their collection
- plant-scoped mode (`plantId` provided): entry is created for that plant directly

## Props

| Prop               | Type                      | Required | Description                                                       |
| ------------------ | ------------------------- | -------- | ----------------------------------------------------------------- |
| `setShowCareModal` | `(show: boolean) => void` | yes      | Controls modal visibility; called with `false` on close/success.  |
| `plantId`          | `string`                  | no       | Optional plant context. When provided, plant selection is hidden. |

## Form Fields

| Field           | Type       | Required    | Notes                                               |
| --------------- | ---------- | ----------- | --------------------------------------------------- |
| `date`          | `date`     | yes         | Defaults to today; cannot be in the future.         |
| `careType`      | `radio`    | yes         | One of `water`, `fertilize`, `repot`, `other`.      |
| `otherCareType` | `text`     | conditional | Required only when `careType = other`; min 3 chars. |
| `plant`         | `select`   | conditional | Required only when `plantId` prop is absent.        |
| `notes`         | `textarea` | no          | Optional free text notes.                           |

## Behavior Notes

- On mount without `plantId`, the component fetches plants via `getAllPlants(user.id)` and shows a spinner while loading.
- On submit, the date is converted with `combineDateWithCurrentTime` and saved through `addCareEntry`.
- A success toast is shown after save, the modal closes, and the page reloads.
- Errors from plant loading or submission are surfaced with toast errors.

## Example Usage

```tsx
<CareModal setShowCareModal={setShowCareModal} />

<CareModal setShowCareModal={setShowCareModal} plantId="plant-123" />
```
