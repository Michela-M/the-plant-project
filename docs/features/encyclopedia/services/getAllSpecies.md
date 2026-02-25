# `getAllSpecies` Service

## Description

`getAllSpecies` fetches all species documents from Firestore collection `species`.
Results are ordered by `commonName` in ascending order and mapped to a normalized shape so the UI can safely render even when optional fields are missing.

The service does not catch Firestore errors; any query failure is propagated to the caller.

## Parameters

This service takes no parameters.

## Return Value

The function returns:

- `Promise<SpeciesListItem[]>` — array of normalized species list items
- `Promise<[]>` — empty array when no species documents exist
- Throws if Firestore request fails

Each returned object has the shape:

```tsx
{
	id: string;
	commonName: string;
	family: string;
	description: string;
	tags: string[];
	image: string;
}
```

## Usage

```tsx
import { getAllSpecies } from '../services/getAllSpecies';

try {
  const species = await getAllSpecies();

  if (species.length === 0) {
    console.log('No species found');
  } else {
    console.log('Loaded species:', species);
  }
} catch (error) {
  console.error('Error loading species:', error);
}
```

## Edge Cases

### Empty collection

If the `species` collection has no documents, the service returns `[]`.

### Missing fields in Firestore documents

Missing fields are normalized to safe defaults:

- `commonName` → `""`
- `family` → `""`
- `description` → `""`
- `tags` → `[]`
- `image` → `""`

### Firestore failures

Network, permission, or query errors are not swallowed and are thrown to the caller for UI handling.
