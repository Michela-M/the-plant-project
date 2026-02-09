# `getAllPlants` Service

## Description

`getAllPlants` retrieves all plant documents from the Firestore `test-plants` collection.
It sorts the results by `creationDate` (newest first), normalizes missing fields to safe defaults, and converts Firestore timestamps into JavaScript `Date` objects.

If Firestore throws an error, the service logs it and returns an empty array, ensuring the UI can safely handle failures without crashing.

## Parameters

This service does not accept any parameters.

## Return Value

| Type            | Description                                                        |
| --------------- | ------------------------------------------------------------------ |
| PromisePlant[]> | Returns an array of normalized plant objects                       |
| Promise<[]>     | Returns an empty array if no documents exist or if an error occurs |

Each returned plant object has the shape:

```jsx
{
  id: string;
  name: string;
  species: string;
  wateringFrequency: number;
  lastWatered: Date | null;
  notes: string;
  creationDate: Date | null;
}
```

## Usage

```jsx
import { getAllPlants } from '../services/getAllPlants';

const plants = await getAllPlants();

if (plants.length > 0) {
  console.log('Loaded plants:', plants);
} else {
  console.log('No plants found or an error occurred');
}
```

## Edge Cases

### No documents in the collection

Returns an empty array (`[]`).

### Missing fields in Firestore

The service normalizes missing fields to prevent UI crashes:

- `species` → `""`
- `wateringFrequency` → `0`
- `lastWatered` → `null`
- `notes` → `""`
- `creationDate` → `null`

### Firestore timestamp fields

`lastWatered` and `creationDate` are converted using `.toDate()` when available.

### Firestore errors

If Firestore throws (network issue, permission error, invalid rules):

- The error is logged
- The function returns `[]`

This ensures the UI can still render gracefully.
