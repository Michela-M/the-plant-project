# `addCareEntry` Service

## Description

`addCareEntry` creates a care-entry document for a specific plant in:

`users/{userId}/plants/{plantId}/careEntries`

It always writes these fields to the care entry:

- `careType`
- `date`
- `notes` (defaults to `""`)
- `otherCareType` (defaults to `""`)

If `careType` is exactly `"water"` (case-sensitive), the service also updates watering metadata on the parent plant document (`users/{userId}/plants/{plantId}`) using values passed in from the caller:

- `inferredWateringFrequency`
- `lastWateredDate`
- `secondLastWateredDate`
- `nextWateringDate`

This service does not calculate watering metadata itself. That logic currently lives in `updateWateringDates`.

## Parameters

| Name                                 | Type             | Required | Description                                                           |
| ------------------------------------ | ---------------- | -------- | --------------------------------------------------------------------- |
| `careData.careType`                  | `string`         | Yes      | Type of care event (for example: `"water"`, `"prune"`, `"fertilize"`) |
| `careData.date`                      | `Date`           | Yes      | Date/time of the care event                                           |
| `careData.notes`                     | `string`         | No       | Optional notes. Defaults to `""`                                      |
| `careData.otherCareType`             | `string`         | No       | Optional custom care text. Defaults to `""`                           |
| `careData.plantId`                   | `string`         | Yes      | Parent plant document ID                                              |
| `careData.userId`                    | `string`         | Yes      | User ID used to scope Firestore path                                  |
| `careData.inferredWateringFrequency` | `number \| null` | No       | Used only for `careType = "water"`; written to plant document.        |
| `careData.lastWateredDate`           | `Date \| null`   | No       | Used only for `careType = "water"`; written to plant document.        |
| `careData.secondLastWateredDate`     | `Date \| null`   | No       | Used only for `careType = "water"`; written to plant document.        |
| `careData.nextWateringDate`          | `Date \| null`   | No       | Used only for `careType = "water"`; written to plant document.        |

## Return Value

Returns `Promise<void>`.

- Resolves when the care entry write is complete and any required plant watering updates are complete.
- Rejects if Firestore write operations fail.

## Usage

```tsx
import { addCareEntry } from '../services/addCareEntry';

await addCareEntry({
  careType: 'water',
  date: new Date(),
  notes: 'Thorough watering after dry soil check',
  plantId: 'plant-123',
  userId: 'user-456',
  inferredWateringFrequency: 7,
  lastWateredDate: new Date(),
  secondLastWateredDate: null,
  nextWateringDate: null,
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
    ...wateringUpdateData,
  });
} catch (error) {
  console.error('Failed to add care entry:', error);
}
```

## Edge Cases

### Non-water care types

For non-water care types, only the care entry is created. Plant watering metadata is not read or updated.

### Missing watering metadata for `water`

If caller code omits watering metadata for a `water` entry, the service still attempts the plant update and writes `undefined` values for those fields.
Caller code should provide a complete watering payload (for example via `updateWateringDates`).

### Multi-write consistency

For `water` care entries, this service performs multiple writes in a single Firestore batch (`set` care entry + `update` plant) and commits once.
