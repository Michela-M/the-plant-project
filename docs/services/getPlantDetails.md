# `getPlantDetails` Service

## Description

`getPlantDetails` is a Firestore read service that retrieves a single plant document from the  
`test-plants` collection using its `plantId`.  
It normalizes missing fields to ensure the UI always receives a predictable, typed object.  
If the document does not exist, the service returns `null`.  
If Firestore throws an error, the error is propagated to the calling code for appropriate handling.

---

## Parameters

| Name      | Type     | Required | Description                                     |
| --------- | -------- | -------- | ----------------------------------------------- |
| `plantId` | `string` | Yes      | The Firestore document ID of the plant to fetch |

---

## Return Value

The function returns one of the following:

- **`Promise<Plant>`** — when the document exists
- **`Promise<null>`** — when the document does not exist
- **Throws an error** — if Firestore fails or the request is invalid

The returned `Plant` object has the following shape:

```jsx
{
  id: string;
  name: string;
  species: string;
  wateringFrequency: number;
  lastWatered: Date | null;
  notes: string;
  creationDate: Date | null;
  imageUrl: string | null;
}
```

All fields are normalized to avoid `undefined` values.

## Usage

```jsx
import { getPlantDetails } from '../services/getPlantDetails';

try {
  const plant = await getPlantDetails('abc123');

  if (plant) {
    console.log('Plant name:', plant.name);
  } else {
    console.log('Plant not found');
  }
} catch (error) {
  console.error('Error fetching plant:', error);
}
```

## Edge Cases

### Document does not exist

The service returns `null` instead of throwing, allowing the UI to handle missing data gracefully.

### Missing or optional fields

All optional fields are normalized:

- `name` → `""`
- `species` → `""`
- `wateringFrequency` → `0`
- `lastWatered` → `null`
- `notes` → `""`
- `creationDate` → `null`
- `imageUrl` → `null`

This prevents undefined values from leaking into the UI.

### Firestore timestamp fields

Timestamp fields (`lastWatered`, `creationDate`) are converted to JavaScript `Date` objects using `.toDate()`.

- If a timestamp field is **present and valid**, it is converted to a `Date`.
- If a timestamp field is **missing or not a valid Firestore `Timestamp`**, it is normalized to `null` (as reflected in the `Plant` type) instead of causing an error.

If Firestore itself fails (for example, due to permission issues, network errors, or an invalid request), the error is not swallowed by this service. It is propagated to the caller, who can then decide how to handle it, for example:

- show a toast or error message
- trigger an error boundary
- retry the request
- log the error for monitoring/analytics
