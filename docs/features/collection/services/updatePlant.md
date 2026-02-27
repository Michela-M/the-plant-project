# `updatePlant` Service

## Description

`updatePlant` updates a plant document in:

`users/{userId}/plants/{plantId}`

It updates editable plant fields (`name`, `species`, `notes`, `imageUrl`, `wateringFrequency`) and recalculates watering metadata using stored plant history.

Watering behavior:

- The service reads the existing plant document first.
- If `wateringFrequency !== 0`, `inferredWateringFrequency` is set to that value.
- If `wateringFrequency !== 0` and `lastWateredDate` exists, `nextWateringDate` is calculated from `lastWateredDate + wateringFrequency`.
- If `wateringFrequency === 0` and both stored watering dates exist, `inferredWateringFrequency` is recalculated from date distance and used for `nextWateringDate`.
- If required date values are missing, `nextWateringDate` remains `null`.

Stored date values are normalized using `firebaseTimestampToDate` to safely handle either JS `Date` or Firebase `Timestamp` values.

## Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `plantId` | `string` | Yes | Plant document ID |
| `userId` | `string` | Yes | User ID used to scope Firestore path |
| `plantData` | `object` | Yes | Editable plant fields to update |

### `plantData` fields

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `name` | `string` | Yes | Plant name |
| `species` | `string` | No | Plant species. Defaults to `""` |
| `wateringFrequency` | `number` | No | Desired watering interval in days. Defaults to `0` |
| `notes` | `string` | No | Optional notes. Defaults to `""` |
| `imageUrl` | `string` | No | Optional image URL. Defaults to `""` |

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

If the document is missing, editable fields are still updated with defaults, and watering schedule fields are computed from empty history (typically resulting in `nextWateringDate: null`).

### `wateringFrequency` is non-zero but no `lastWateredDate`

`inferredWateringFrequency` is set to `wateringFrequency`, but `nextWateringDate` stays `null` because there is no base date.

### `wateringFrequency` is zero with full watering history

When both `lastWateredDate` and `secondLastWateredDate` exist, inferred frequency is recalculated from the two dates and used to derive `nextWateringDate`.

### `wateringFrequency` is zero with missing history

If one or both stored watering dates are missing, inferred recalculation is skipped and `nextWateringDate` remains `null`.

### Date shape differences from Firestore

Stored date fields may be JS `Date` or Firebase `Timestamp`; invalid values normalize to `null`.

### Unknown thrown values

If a non-`Error` value is thrown internally, it is converted to `new Error('Unknown error')`.
