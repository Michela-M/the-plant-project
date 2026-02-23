# `getCareHistory` Service

## Description

`getCareHistory` fetches all care entries for a plant from Firestore at:
`users/{userId}/plants/{plantId}/careEntries`.

Results are sorted by `date` in descending order (newest first).
Firestore timestamps are converted to JavaScript `Date` objects before being returned.

## Parameters

| Name      | Type     | Required | Description                                         |
| --------- | -------- | -------- | --------------------------------------------------- |
| `plantId` | `string` | Yes      | Plant document ID used in the Firestore path        |
| `userId`  | `string` | Yes      | User ID used to scope the Firestore collection path |

## Return Value

The function returns:

- `Promise<Array<CareHistoryEntry>>` — resolves to an array of care entries
- Throws if Firestore read/query fails

Returned item shape:

```tsx
{
  id: string;
  date: Date;
  careType: string;
  notes: string;
  otherCareType: string;
}
```

`otherCareType` and `notes` are normalized to `""` when missing in Firestore.

## Usage

```tsx
import { getCareHistory } from '../services/getCareHistory';

const history = await getCareHistory('plant-456', 'user-123');

history.forEach((entry) => {
  console.log(entry.date, entry.careType, entry.notes);
});
```

With basic error handling:

```tsx
try {
  const history = await getCareHistory(plantId, userId);
  setCareHistory(history);
} catch (error) {
  console.error('Failed to load care history:', error);
}
```

## Edge Cases

### No care entries

If the subcollection is empty, the function returns `[]`.

### Missing optional fields

If a document does not include `otherCareType` or `notes`, the returned values are normalized to `""`.

### Timestamp conversion expectations

The service expects `date` to be stored as a Firestore `Timestamp`.
If `date` has an incompatible shape, `.toDate()` can fail.

### Invalid or missing IDs

If `userId` or `plantId` is missing/invalid, the query path is invalid and Firestore will throw.

### Permission and network failures

Permission-denied or network issues are propagated to the caller.
