# `getAllPlants` Service

## Description

`getAllPlants` retrieves all plant documents from the Firestore `test-plants` collection.
It sorts the results by `creationDate` (newest first) and normalizes missing fields to safe defaults.

If Firestore throws an error (network issue, permission error, etc.), the error is propagated to the caller, allowing the UI to handle and display appropriate error messages.

## Parameters

This service does not accept any parameters.

## Return Value

| Type             | Description                                  |
| ---------------- | -------------------------------------------- |
| Promise<Plant[]> | Returns an array of normalized plant objects |
| Promise<[]>      | Returns an empty array if no documents exist |
| Throws           | Throws an error if Firestore operation fails |

Each returned plant object has the shape:

```jsx
{
  id: string;
  name: string;
  species: string;
  imageUrl: string | null;
}
```

## Usage

```jsx
import { getAllPlants } from '../services/getAllPlants';

try {
  const plants = await getAllPlants();

  if (plants.length > 0) {
    console.log('Loaded plants:', plants);
  } else {
    console.log('No plants found');
  }
} catch (error) {
  console.error('Error loading plants:', error);
}
```

## Edge Cases

### No documents in the collection

Returns an empty array (`[]`).

### Missing fields in Firestore

The service normalizes missing fields to prevent UI crashes:

- `name` → `"Unnamed Plant"`
- `species` → `""`
- `imageUrl` → `null`

### Firestore errors

If Firestore throws (network issue, permission error, invalid rules), the error is propagated to the caller. The calling code should handle these errors appropriately and display error messages to the user.
