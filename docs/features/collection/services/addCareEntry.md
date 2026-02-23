# `addCareEntry` Service

## Description

`addCareEntry` creates a care-entry document for a specific plant in a user-scoped Firestore subcollection:
`users/{userId}/plants/{plantId}/careEntries`.

It writes the care event type, date, optional notes, and optional custom care label (`otherCareType`).
Optional string fields are normalized to an empty string when omitted.
This service performs only the write operation and does not return the new document ID.

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

### Invalid or missing IDs

If `userId` or `plantId` is missing/invalid, Firestore path resolution fails and the service throws.

### Invalid dates

`date` must be a valid JavaScript `Date`. Invalid dates can cause Firestore write errors.

### Unknown error values

If Firestore throws a non-`Error` value, the service wraps it as `new Error('Unknown error')`.

### Permission and network failures

Permission-denied or network issues are not swallowed; they are rethrown so the caller can surface a toast or retry flow.
