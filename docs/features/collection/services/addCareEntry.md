# `addCareEntry` Service

## Description

`addCareEntry` creates a care-entry document for a specific plant in a user-scoped Firestore subcollection:
`users/{userId}/plants/{plantId}/careEntries`.

It writes the care event type, date, optional notes, and optional custom care label (`otherCareType`).
Optional string fields are normalized to an empty string when omitted.

For water-related care types (strings starting with `"water"`, case-insensitive), the service also updates plant-level watering metadata on `users/{userId}/plants/{plantId}`.

This service does not return the new care entry document ID.

## Parameters

| Name                     | Type     | Required | Description                                                        |
| ------------------------ | -------- | -------- | ------------------------------------------------------------------ |
| `careData.careType`      | `string` | Yes      | Type of care event                                                 |
| `careData.date`          | `Date`   | Yes      | Date/time of the care event                                        |
| `careData.notes`         | `string` | No       | Optional notes. Defaults to `""` when not provided                 |
| `careData.otherCareType` | `string` | No       | Optional custom care type text. Defaults to `""` when not provided |
| `careData.plantId`       | `string` | Yes      | Plant document ID used in the Firestore path                       |
| `careData.userId`        | `string` | Yes      | User ID used to scope the Firestore path                           |

## Return Value

The function returns:

- `Promise<void>` — resolves when the care entry is successfully written
- Throws if Firestore fails

No value is returned because the created care entry document ID is not surfaced by this service.

## Water-entry Side Effects

When `careType` starts with `"water"`:

1. The service fetches the plant document.
2. It compares the new care `date` with existing `lastWateredDate` and `secondLastWateredDate`.
3. It updates watering metadata when appropriate:

- `lastWateredDate`
- `secondLastWateredDate`
- `inferredWateringFrequency`
- `nextWateringDate`

If the plant document does not exist, the function returns after creating the care entry.

## Usage

```tsx
import { addCareEntry } from '../services/addCareEntry';

await addCareEntry({
  userId: 'user-123',
  plantId: 'plant-456',
  careType: 'other',
  otherCareType: 'Mist leaves',
  date: new Date(),
  notes: 'Light misting after repot',
});
```

With basic error handling:

```tsx
try {
  await addCareEntry({
    userId,
    plantId,
    careType: values.careType,
    date: values.date,
    notes: values.notes,
    otherCareType: values.otherCareType,
  });
} catch (error) {
  console.error('Failed to add care entry:', error);
}
```

## Edge Cases

### Missing optional notes

If `notes` is omitted, the service stores `""` to keep the Firestore field shape consistent.

### Missing optional custom care label

If `otherCareType` is omitted, the service stores `""`.
This allows the UI to read a consistent string field without undefined checks.

### Non-water care types

For care types that do not begin with `"water"`, only the care entry is created.
No plant-level watering metadata is changed.

### Water care with older dates

If the new water date is:

- newer than current `lastWateredDate`, it becomes the new `lastWateredDate`
- between current `lastWateredDate` and `secondLastWateredDate`, it may become the new `secondLastWateredDate`
- older than both, plant watering metadata is left unchanged

### Inferred watering frequency

When enough date history exists, `inferredWateringFrequency` is recalculated using the two most recent watering dates and used to derive `nextWateringDate`.

### Invalid or missing IDs

If `userId` or `plantId` is missing/invalid, Firestore path resolution fails and the service throws.

### Invalid dates

`date` must be a valid JavaScript `Date`. Invalid dates can cause Firestore write errors.

### Unknown error values

If Firestore throws a non-`Error` value, the service wraps it as `new Error('Unknown error')`.

### Permission and network failures

Permission-denied or network issues are not swallowed; they are rethrown so the caller can surface a toast or retry flow.
