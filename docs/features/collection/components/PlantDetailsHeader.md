# `PlantDetailsHeader`

## Purpose

The **PlantDetailsHeader** component renders the top section of the plant details page. It shows plant identity, provides quick actions (new item menu and options menu), and handles destructive deletion confirmation.

## Props

| Prop    | Type   | Required | Description                                        |
| ------- | ------ | -------- | -------------------------------------------------- |
| `plant` | object | yes      | Plant data used for display and action navigation. |

### `plant` shape

| Field        | Type     | Required | Description                                   |
| ------------ | -------- | -------- | --------------------------------------------- |
| `id`         | `string` | yes      | Used for edit navigation and delete action.   |
| `name`       | `string` | yes      | Displayed as the main header title.           |
| `commonName` | `string` | no       | Optional subtitle shown above the plant name. |

## Behavior Notes

- Back button navigates to `/collection`.
- `New` button opens a menu with disabled placeholder items (`Care`, `Reminder`).
- Options menu provides `Edit`, `Delete`, and disabled `Remove from schedule`.
- Delete opens a destructive confirmation modal.
- Confirmed delete calls `deletePlant`, shows toast feedback, and navigates to `/collection` on success.

## Example Usage

```jsx
<PlantDetailsHeader
  plant={{
    id: 'plant-1',
    name: 'John',
    commonName: 'Monstera Deliciosa',
  }}
/>
```
