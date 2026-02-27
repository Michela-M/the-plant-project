# `addPlant` Service

## Description

`addPlant` creates a new plant document in the signed-in user’s collection at `users/{userId}/plants`.
It normalizes optional fields, writes watering-tracking metadata, and always sets a `creationDate` timestamp.

If `lastWateredDate` is provided, the service also creates an initial `careEntries` record (`careType: "water"`) for the new plant.

This service only writes the document and does not return the created document ID.

## Parameters

| Name                          | Type           | Required | Description                        |
| ----------------------------- | -------------- | -------- | ---------------------------------- |
| `plantData.name`              | `string`       | Yes      | Plant name                         |
| `plantData.userId`            | `string`       | Yes      | User ID used in the Firestore path |
| `plantData.species`           | `string`       | No       | Defaults to `""`                   |
| `plantData.notes`             | `string`       | No       | Defaults to `""`                   |
| `plantData.wateringFrequency` | `number`       | No       | Defaults to `0`                    |
| `plantData.lastWateredDate`   | `Date \| null` | No       | Defaults to `null`                 |

### Derived fields written to Firestore

In addition to input fields, `addPlant` writes:

- `nextWateringDate`: `Date | null` (calculated only when both `lastWateredDate` and `wateringFrequency > 0` are present)
- `trackWatering`: `boolean` (`true` only when `nextWateringDate` can be calculated)
- `secondLastWateredDate`: always `null` on creation
- `inferredWateringFrequency`: always `null` on creation

## Return Value

The function returns:

- `Promise<void>` — resolves when the document is successfully written
- Throws if Firestore fails

No value is returned because the created document ID is not surfaced by this service.

## Side Effects

When `lastWateredDate` is provided:

- A care entry is created at `users/{userId}/plants/{newPlantId}/careEntries`
- Payload: `{ careType: 'water', date: lastWateredDate, notes: '' }`

## Usage

```tsx
import { addPlant } from '../services/addPlant';

await addPlant({
  userId: 'user-123',
  name: 'Aloe Vera',
  species: 'Aloe',
  wateringFrequency: 7,
  lastWateredDate: new Date(),
  notes: 'Prefers bright light',
});
```

## Edge Cases

### Missing optional fields

All optional fields are safely normalized:

- `species` → `""`
- `notes` → `""`
- `wateringFrequency` → `0`
- `lastWateredDate` → `null`

Derived values are also normalized:

- `nextWateringDate` → `null` when not enough data to calculate
- `trackWatering` → `false` when not enough data to calculate
- `secondLastWateredDate` → `null`
- `inferredWateringFrequency` → `null`

### `lastWateredDate` without frequency

If `lastWateredDate` exists but `wateringFrequency` is missing or `0`, the initial care entry is still created, but `nextWateringDate` remains `null` and `trackWatering` is `false`.

### Invalid or unexpected Firestore errors

If Firestore throws a non‑Error value (e.g., a string), the service wraps it in a new `Error('Unknown error')`.

### Network or permission failures

Any Firestore failure is rethrown so the UI can show a toast or fallback state.
