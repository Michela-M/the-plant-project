# `addCareEntry` Service

## Description

`addCareEntry` creates a care-entry document for a specific plant in:

`users/{userId}/plants/{plantId}/careEntries`

It always writes these fields to the care entry:

- `careType`
- `date`
- `notes` (defaults to `""`)
- `otherCareType` (defaults to `""`)

If `careType` is exactly `"water"`, the service also updates watering metadata on the parent plant document (`users/{userId}/plants/{plantId}`):

- updates `lastWateredDate` / `secondLastWateredDate` based on date ordering
- recalculates `inferredWateringFrequency` when both watering dates are available
- computes `nextWateringDate` using explicit `wateringFrequency` first, then inferred frequency

To support Firestore data safely, existing plant date fields are normalized from either JS `Date` or Firebase `Timestamp` via `firebaseTimestampToDate`.

## Parameters

| Name                     | Type     | Required | Description                                                           |
| ------------------------ | -------- | -------- | --------------------------------------------------------------------- |
| `careData.careType`      | `string` | Yes      | Type of care event (for example: `"water"`, `"prune"`, `"fertilize"`) |
| `careData.date`          | `Date`   | Yes      | Date/time of the care event                                           |
| `careData.notes`         | `string` | No       | Optional notes. Defaults to `""`                                      |
| `careData.otherCareType` | `string` | No       | Optional custom care text. Defaults to `""`                           |
| `careData.plantId`       | `string` | Yes      | Parent plant document ID                                              |
| `careData.userId`        | `string` | Yes      | User ID used to scope Firestore path                                  |

## Return Value

Returns `Promise<void>`.

- Resolves when the care entry write is complete and any required plant watering updates are complete.
- Rejects if Firestore read/write operations fail or if date computation throws.

## Usage

```tsx
import { addCareEntry } from '../services/addCareEntry';

await addCareEntry({
  careType: 'water',
  date: new Date(),
  notes: 'Thorough watering after dry soil check',
  plantId: 'plant-123',
  userId: 'user-456',
});
```

With error handling:

```tsx
try {
  await addCareEntry({
    careType: values.careType,
    date: values.date,
    notes: values.notes,
    otherCareType: values.otherCareType,
    plantId,
    userId,
  });
} catch (error) {
  console.error('Failed to add care entry:', error);
}
```

## Edge Cases

### Non-water care types

For non-water care types, only the care entry is created. Plant watering metadata is not read or updated.

### Water entry newer than `lastWateredDate`

The new date becomes `lastWateredDate`, and the old `lastWateredDate` moves to `secondLastWateredDate`.

### Water entry between `lastWateredDate` and `secondLastWateredDate`

`lastWateredDate` stays unchanged and `secondLastWateredDate` is updated to the new date.

### Missing plant document

If the plant document does not exist, the care entry is still created, but watering metadata update is skipped.

### Date normalization

Existing plant date fields can be JS `Date` or Firebase `Timestamp`. Invalid values normalize to `null`.

### Next watering date selection

`nextWateringDate` preference order:

1. explicit `wateringFrequency` (if non-zero)
2. `inferredWateringFrequency` (if non-zero)

If both are `0`, `nextWateringDate` is `null`.

### Multi-write consistency

For `water` care entries, this service performs multiple Firestore operations (create care entry, read plant, update plant). A later failure does not automatically roll back earlier successful writes.
