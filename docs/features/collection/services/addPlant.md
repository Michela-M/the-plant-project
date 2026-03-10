# `addPlant` Service

## Description

`addPlant` creates a new plant document in the user-scoped Firestore collection:

`users/{userId}/plants`

It accepts a complete plant payload (including watering-related fields already computed by the caller), writes the plant document, and optionally writes an initial watering entry.

If `lastWateredDate` is provided, the service also creates an initial care entry in:

`users/{userId}/plants/{plantId}/careEntries`

with:

- `careType: "water"`
- `date: lastWateredDate`

Both writes are queued in a single Firestore `writeBatch` and committed atomically.

## Parameters

| Name                          | Type           | Required | Description                                                |
| ----------------------------- | -------------- | -------- | ---------------------------------------------------------- |
| `plantData.name`              | `string`       | Yes      | Plant name                                                 |
| `plantData.userId`            | `string`       | Yes      | User ID used to scope Firestore path                       |
| `plantData.species`           | `string`       | Yes      | Plant species                                              |
| `plantData.notes`             | `string`       | Yes      | Freeform notes                                             |
| `plantData.wateringFrequency` | `number`       | Yes      | Planned watering interval (days)                           |
| `plantData.lastWateredDate`   | `Date \| null` | Yes      | Most recent watering date                                  |
| `plantData.nextWateringDate`  | `Date \| null` | Yes      | Next watering date (precomputed by caller when applicable) |
| `plantData.trackWatering`     | `boolean`      | Yes      | Whether watering tracking is enabled                       |

## Return Value

`Promise<void>`.

The promise resolves when the batch commit succeeds. It rejects if any batch operation fails.

## Usage

```tsx
import { addPlant } from '../services/addPlant';

await addPlant({
  lastWateredDate: new Date('2026-02-20'),
  name: 'Aloe Vera',
  nextWateringDate: new Date('2026-02-27'),
  notes: 'Keep in bright indirect light',
  species: 'Aloe barbadensis miller',
  trackWatering: true,
  userId: 'user-123',
  wateringFrequency: 7,
});
```

With basic error handling:

```tsx
try {
  await addPlant({
    lastWateredDate: values.lastWateredDate,
    name: values.name,
    nextWateringDate: values.nextWateringDate,
    notes: values.notes,
    species: values.species,
    trackWatering: values.trackWatering,
    userId,
    wateringFrequency: values.wateringFrequency,
  });
} catch (error) {
  console.error('Failed to add plant:', error);
}
```

## Edge Cases

### Caller-owned defaults and calculations

This service does not apply defaults or compute watering dates. The caller must provide final values for `nextWateringDate`, `trackWatering`, `notes`, and other fields.

### `lastWateredDate` controls care-entry creation

If `lastWateredDate` is `null`, no care entry is added.
If `lastWateredDate` is present, one care entry is batched with `{ type: 'watering', date: lastWateredDate }`.

### Invalid `lastWateredDate`

If `lastWateredDate` is an invalid `Date`, Firestore serialization/validation may fail at write time and the promise rejects.

### Firestore/network/permission errors

Errors from `writeBatch(...).commit()` are rethrown so callers can handle user feedback, retries, or telemetry.

### Atomic write behavior

Plant creation and optional initial water care entry are committed together in one batch. Either all writes succeed, or none are committed.

### Unknown thrown values

If a non-`Error` value is thrown internally, it is converted to `new Error('Unknown error')`.
