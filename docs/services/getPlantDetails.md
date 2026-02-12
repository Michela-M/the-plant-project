# `getPlantDetails` Service

## Description

`getPlantDetails` is a Firestore read service that retrieves a single plant document from the  
`test-plants` collection using its `plantId`.  
It normalizes missing fields to ensure the UI always receives a predictable, typed object.  
If the document does not exist, the service returns `null`.  
If Firestore throws an error, the service logs it and rethrows so calling code can handle it appropriately.

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

const plant = await getPlantDetails('abc123');

if (plant) {
  console.log('Plant name:', plant.name);
} else {
  console.log('Plant not found');
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
If the field is missing or not a timestamp, the value becomes `null`.

### Firestore errors

Any Firestore error is logged and rethrown so the caller can:

- show a toast
- trigger an error boundary
- retry the request
