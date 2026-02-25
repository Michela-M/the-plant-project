# `getSpeciesDetails` Service

## Description

`getSpeciesDetails` fetches one species document from Firestore path `species/{speciesId}`.
If the document exists, the service returns a normalized details object, including section blocks like watering/light/humidity and fallback defaults for missing fields.

If the document does not exist, it returns `null`.
Firestore read errors are propagated to the caller.

## Parameters

| Name        | Type     | Required | Description                           |
| ----------- | -------- | -------- | ------------------------------------- |
| `speciesId` | `string` | Yes      | Species document ID in `species` path |

## Return Value

The function returns:

- `Promise<SpeciesDetailsData | null>`
- `null` when the species document does not exist
- Throws if Firestore read fails

Returned object shape:

```tsx
{
	id: string;
	commonName: string;
	scientificName: string;
	family: string;
	description: string;
	tags: string[];
	image: string;
	otherNames: string[];
	type: string[];
	similarSpecies: string[];
	characteristics: {
		difficulty: number;
		toxicity: number;
		maintenance: number;
		light: number;
		pruning: number;
		propagation: number;
	};

	watering: { text: string; images: { url: string; description: string }[] };
	light: { text: string; images: { url: string; description: string }[] };
	humidity: { text: string; images: { url: string; description: string }[] };
	temperature: { text: string; images: { url: string; description: string }[] };
	soilAndRepotting: {
		text: string;
		images: { url: string; description: string }[];
	};
	fertilizing: { text: string; images: { url: string; description: string }[] };
	pestsAndProblems: {
		text: string;
		images: { url: string; description: string }[];
	};
	propagation: { text: string; images: { url: string; description: string }[] };
}
```

## Usage

```tsx
import { getSpeciesDetails } from '../services/getSpeciesDetails';

try {
  const details = await getSpeciesDetails('species-123');

  if (!details) {
    console.log('Species not found');
  } else {
    console.log('Species details loaded:', details.commonName);
  }
} catch (error) {
  console.error('Error loading species details:', error);
}
```

## Edge Cases

### Species does not exist

Returns `null` when `species/{speciesId}` is not found.

### Missing fields in Firestore document

Top-level and section fields are normalized to defaults:

- missing strings → `""`
- missing arrays → `[]`
- missing section objects (`watering`, `light`, etc.) → `{ text: "", images: [] }`
- missing or partial `characteristics` fields → defaulted per key to `0`
  - `difficulty`, `toxicity`, `maintenance`, `light`, `pruning`, `propagation`

### Firestore failures

Permission, network, or read errors are thrown to the caller.
