# `updateNextWatering` Service

## Description

`updateNextWatering` updates a plant's `nextWateringDate` in Firestore at:
`users/{userId}/plants/{plantId}`.

When the date is set to `null`, it also disables watering tracking by writing `trackWatering: false`.

## Parameters

| Name               | Type           | Required | Description                                                     |
| ------------------ | -------------- | -------- | --------------------------------------------------------------- |
| `plantId`          | `string`       | Yes      | Plant document id to update.                                    |
| `userId`           | `string`       | Yes      | User id used to build the Firestore path.                       |
| `nextWateringDate` | `Date \| null` | Yes      | Next reminder date, or `null` to stop tracking future watering. |

## Write Behavior

- Always writes `nextWateringDate`.
- Additionally writes `trackWatering: false` when `nextWateringDate` is `null`.

Payload examples:

```tsx
// keep tracking with a specific date
{ nextWateringDate: new Date('2026-03-08T10:00:00.000Z') }

// stop tracking reminders
{ nextWateringDate: null, trackWatering: false }
```

## Return Value

- `Promise<void>` when the update succeeds.
- Throws when Firestore write fails.

## Error Handling

- Re-throws native `Error` instances from Firestore.
- Converts non-`Error` failures into `new Error('Unknown error')`.

## Usage

```tsx
import { updateNextWatering } from '../services/updateNextWateringDate';

await updateNextWatering('plant-123', 'user-123', new Date());

await updateNextWatering('plant-123', 'user-123', null);
```
