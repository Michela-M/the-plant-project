# `getScheduledPlants` Service

## Description

`getScheduledPlants` fetches scheduled plants for a specific user from Firestore at:
`users/{userId}/plants`.

It filters to plants where `trackWatering === true`, sorts by `nextWateringDate` ascending, and normalizes missing fields to safe defaults.

The service converts Firestore date-like values into JavaScript `Date` objects for:

- `nextWateringDate` (via `.toDate()` when present)
- `lastWateredDate` (via `.toDate()` when present)

If Firestore fails (permissions, network, invalid query/index), the error is propagated to the caller.

## Parameters

| Name     | Type     | Required | Description                                               |
| -------- | -------- | -------- | --------------------------------------------------------- |
| `userId` | `string` | Yes      | User ID used to build the Firestore path and query plants |

## Return Value

The function returns:

- `Promise<Array<ScheduledPlant>>` — resolves to a normalized list of scheduled plants
- `Promise<[]>` — resolves to an empty array when no documents match
- Throws if Firestore read/query fails

Returned item shape:

```tsx
{
  id: string;
  imageUrl: string | null;
  name: string;
  speciesName: string;
  wateringFrequency: number | null;
  nextWateringDate: Date | null;
  lastWateredDate: Date | null;
  inferredWateringFrequency: number | null;
}
```

## Usage

```tsx
import { getScheduledPlants } from '../services/getScheduledPlants';

try {
  const plants = await getScheduledPlants('user-123');
  console.log('Scheduled plants:', plants);
} catch (error) {
  console.error('Failed to load scheduled plants:', error);
}
```

## Edge Cases

### No matching plants

If no plants match `trackWatering === true`, the function returns `[]`.

### Missing fields in Firestore

The service normalizes missing fields:

- `imageUrl` → `null`
- `name` → `"Unnamed Plant"`
- `speciesName` → `""`
- `wateringFrequency` → `null`
- `nextWateringDate` → `null`
- `lastWateredDate` → `null`
- `inferredWateringFrequency` → `null`

### Date conversion assumptions

- `nextWateringDate` is expected to expose `.toDate()` when present.
- `lastWateredDate` is expected to expose `.toDate()` when present.

If stored values have incompatible shapes, date conversion can produce invalid values or throw at runtime.

### Firestore failures

Errors from Firestore are not swallowed; they are propagated so the UI/service caller can handle them.
