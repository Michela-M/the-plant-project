# `updatePlant` Service

## Description

`updatePlant` updates a plant document in:

`users/{userId}/plants/{plantId}`

It performs a **partial update** of editable fields and recalculates watering metadata only when `wateringFrequency` is explicitly provided.

Fields that may be written by this service (only when provided or derived):

- `name` (when provided)
- `species` (when provided)
- `notes` (when provided)
- `imageUrl` (when provided)
- `trackWatering` (when provided)
- `wateringFrequency` (when provided)
- `inferredWateringFrequency` (when `wateringFrequency` is provided)
- `nextWateringDate` (when `wateringFrequency` is provided)

Watering behavior:

- The service reads the existing plant document first.
- `lastWateredDate` and `secondLastWateredDate` are read from stored plant data and used for calculations.
- Watering calculations run only when `plantData.wateringFrequency` is provided.
- If provided `wateringFrequency !== 0`, `inferredWateringFrequency` is set to that value.
- If provided `wateringFrequency !== 0` and `lastWateredDate` exists, `nextWateringDate` is calculated from `lastWateredDate + wateringFrequency`.
- If provided `wateringFrequency === 0` and both stored watering dates exist, `inferredWateringFrequency` is recalculated from date distance and used for `nextWateringDate`.
- If provided `wateringFrequency === 0` and required date values are missing, `nextWateringDate` is set to `null`.

Stored date values are normalized using `firebaseTimestampToDate` to safely handle either JS `Date` or Firebase `Timestamp` values.

## Parameters

| Name        | Type     | Required | Description                             |
| ----------- | -------- | -------- | --------------------------------------- |
| `plantId`   | `string` | Yes      | Plant document ID                       |
| `userId`    | `string` | Yes      | User ID used to scope Firestore path    |
| `plantData` | `object` | Yes      | Partial editable plant fields to update |

### `plantData` fields

| Field               | Type      | Required | Description                                  |
| ------------------- | --------- | -------- | -------------------------------------------- |
| `name`              | `string`  | No       | Plant name                                   |
| `species`           | `string`  | No       | Plant species                                |
| `wateringFrequency` | `number`  | No       | Desired watering interval in days            |
| `notes`             | `string`  | No       | Optional notes                               |
| `imageUrl`          | `string`  | No       | Optional image URL                           |
| `trackWatering`     | `boolean` | No       | Whether watering reminders should be tracked |

## Return Value

Returns `Promise<void>`.

- Resolves when the Firestore update succeeds.
- Rejects when Firestore read/write fails or a date calculation throws.

## Usage

```tsx
import { updatePlant } from '../services/updatePlant';

await updatePlant(
  'plant-123',
  {
    name: 'Monstera Deliciosa',
    species: 'Monstera deliciosa',
    wateringFrequency: 7,
    notes: 'Rotate weekly for even growth',
    imageUrl: 'https://example.com/plant.jpg',
  },
  'user-456'
);
```

With basic error handling:

```tsx
try {
  await updatePlant(plantId, values, userId);
} catch (error) {
  console.error('Failed to update plant:', error);
}
```

## Edge Cases

### Missing stored plant document

If the document is missing, only explicitly provided fields are written. Watering schedule fields are written only if `wateringFrequency` is provided.

### `wateringFrequency` is non-zero but no `lastWateredDate`

`inferredWateringFrequency` is set to `wateringFrequency`, but `nextWateringDate` stays `null` because there is no base date.

### `wateringFrequency` is zero with full watering history

When both `lastWateredDate` and `secondLastWateredDate` exist, inferred frequency is recalculated from the two dates and used to derive `nextWateringDate`.

### `wateringFrequency` omitted

No watering schedule fields are recalculated or written. Existing watering data remains unchanged.

### `wateringFrequency` is zero with missing history

If one or both stored watering dates are missing, inferred recalculation is skipped and `nextWateringDate` is written as `null`.

### Date shape differences from Firestore

Stored date fields may be JS `Date` or Firebase `Timestamp`; invalid values normalize to `null`.

### Unknown thrown values

If a non-`Error` value is thrown internally, it is converted to `new Error('Unknown error')`.

### Empty update payload

If `plantData` does not contain any supported fields, the function returns early and does not call Firestore `updateDoc`.
