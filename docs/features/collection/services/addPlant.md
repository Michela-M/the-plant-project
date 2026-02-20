# `addPlant` Service

## Description

`addPlant` creates a new plant document in the signed-in user’s collection at `users/{userId}/plants`.
It normalizes optional fields and always writes a `creationDate` timestamp.

This service only writes the document and does not return the created document ID.

## Parameters

| Name                          | Type           | Required | Description                        |
| ----------------------------- | -------------- | -------- | ---------------------------------- |
| `plantData.name`              | `string`       | Yes      | Plant name                         |
| `plantData.userId`            | `string`       | Yes      | User ID used in the Firestore path |
| `plantData.species`           | `string`       | No       | Defaults to `""`                   |
| `plantData.notes`             | `string`       | No       | Defaults to `""`                   |
| `plantData.wateringFrequency` | `number`       | No       | Defaults to `0`                    |
| `plantData.lastWatered`       | `Date \| null` | No       | Defaults to `null`                 |

## Return Value

The function returns:

- `Promise<void>` — resolves when the document is successfully written
- Throws if Firestore fails

No value is returned because the created document ID is not surfaced by this service.

## Usage

```tsx
import { addPlant } from '../services/addPlant';

await addPlant({
  userId: 'user-123',
  name: 'Aloe Vera',
  species: 'Aloe',
  wateringFrequency: 7,
  lastWatered: new Date(),
  notes: 'Prefers bright light',
});
```

## Edge Cases

### Missing optional fields

All optional fields are safely normalized:

- `species` → `""`
- `notes` → `""`
- `wateringFrequency` → `0`
- `lastWatered` → `null`

### Invalid or unexpected Firestore errors

If Firestore throws a non‑Error value (e.g., a string), the service wraps it in a new `Error('Unknown error')`.

### Network or permission failures

Any Firestore failure is rethrown so the UI can show a toast or fallback state.
