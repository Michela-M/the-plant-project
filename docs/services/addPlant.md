# `addPlant` Service

## Description

`addPlant` is a Firestore write service that creates a new plant entry in the `test-plants` collection.
It normalizes optional fields to ensure consistent data structure and automatically attaches a `creationDate` timestamp.
If Firestore throws an error, the service rethrows a clean `Error` instance so calling code can handle it predictably.

## Parameters

| Name                | Type         | Required | Description                               |
| ------------------- | ------------ | -------- | ----------------------------------------- |
| `name`              | `string`     | Yes      | The plant’s name                          |
| `species`           | `string`     | No       | Species name; defaults to an empty string |
| `wateringFrequency` | `number`     | No       | Days between watering; defaults to 0      |
| `lastWatered`       | `Date \	null` | No       | Last watering date; defaults to null      |
| `notes`             | `string`     | No       | defaults to an empty string               |

## Return Value

The function returns:

- `Promise<void>` — resolves when the document is successfully written
- Throws an `Error` if Firestore fails

No value is returned because Firestore auto‑generates the document ID internally.

## Usage

```jsx
import { addPlant } from '../services/addPlant';

await addPlant({
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
- `wateringFrequency` → `0`
- `lastWatered` → `null`
- `notes` → `""`

### Invalid or unexpected Firestore errors

If Firestore throws a non‑Error value (e.g., a string), the service wraps it in a new `Error('Unknown error')`.

### Network or permission failures

Any Firestore failure is rethrown so the UI can show a toast or fallback state.
