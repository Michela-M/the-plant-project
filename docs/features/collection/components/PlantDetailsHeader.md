# `PlantDetailsHeader`

## Purpose

The **PlantDetailsHeader** component renders the top section of the plant details page. It shows plant identity, provides quick actions (new item menu and options menu), and handles destructive deletion confirmation.

## Props

| Prop                    | Type                               | Required | Description                                                        |
| ----------------------- | ---------------------------------- | -------- | ------------------------------------------------------------------ |
| `plant`                 | object                             | yes      | Plant data used for display and action navigation.                 |
| `onTrackWateringChange` | `(trackWatering: boolean) => void` | no       | Optional callback fired after successful watering tracking toggle. |

### `plant` shape

| Field           | Type      | Required | Description                                                                  |
| --------------- | --------- | -------- | ---------------------------------------------------------------------------- |
| `id`            | `string`  | yes      | Used for edit navigation and delete action.                                  |
| `name`          | `string`  | yes      | Displayed as the main header title.                                          |
| `commonName`    | `string`  | no       | Optional subtitle shown above the plant name.                                |
| `trackWatering` | `boolean` | yes      | Controls whether action label is `Track watering` or `Remove from schedule`. |

## Behavior Notes

- Back button navigates to `/collection`.
- `New` button opens a menu with `Care` action and a disabled `Reminder` placeholder.
- Options menu provides `Edit`, `Delete`, and watering tracking toggle (`Track watering` / `Remove from schedule`).
- Delete opens a destructive confirmation modal.
- Watering toggle updates only `trackWatering` on the plant record.
- When provided, `onTrackWateringChange` is called after successful toggle so parent state can update immediately.
- Confirmed delete calls `deletePlant`, shows toast feedback, and navigates to `/collection` on success.

## Example Usage

```jsx
<PlantDetailsHeader
  plant={{
    id: 'plant-1',
    name: 'John',
    commonName: 'Monstera Deliciosa',
    trackWatering: true,
  }}
/>
```
