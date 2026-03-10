# `updatePlant` Service

## Description

`updatePlant` updates a plant document in:

`users/{userId}/plants/{plantId}`

It performs a **partial Firestore update** using only the fields passed in `plantData`.

This service does **not** fetch existing plant data or derive watering fields. It forwards the provided payload directly to `updateDoc`.

Fields that may be written by this service (when provided):

- `name`
- `species`
- `notes`
- `imageUrl`
- `wateringFrequency`
- `nextWateringDate`
- `inferredWateringFrequency`

## Parameters

| Name        | Type                                                                                                                                                                              | Required | Description                          |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------ |
| `plantId`   | `string`                                                                                                                                                                          | Yes      | Plant document ID                    |
| `plantData` | `{ imageUrl?: string; name?: string; notes?: string; species?: string; wateringFrequency?: number; nextWateringDate?: Date \| null; inferredWateringFrequency?: number \| null }` | Yes      | Partial plant fields to update       |
| `userId`    | `string`                                                                                                                                                                          | Yes      | User ID used to scope Firestore path |

### `plantData` fields

| Field                       | Type             | Required | Description                        |
| --------------------------- | ---------------- | -------- | ---------------------------------- |
| `name`                      | `string`         | No       | Plant name                         |
| `species`                   | `string`         | No       | Plant species                      |
| `notes`                     | `string`         | No       | Optional notes                     |
| `imageUrl`                  | `string`         | No       | Optional image URL                 |
| `wateringFrequency`         | `number`         | No       | Watering interval in days          |
| `nextWateringDate`          | `Date \| null`   | No       | Next scheduled watering date       |
| `inferredWateringFrequency` | `number \| null` | No       | Inferred watering interval in days |

## Return Value

Returns `Promise<void>`.

- Resolves when the Firestore update succeeds.
- Rejects when Firestore update fails.

## Usage

```tsx
import { updatePlant } from '../services/updatePlant';

await updatePlant(
  'plant-123',
  {
    name: 'Monstera Deliciosa',
    species: 'Monstera deliciosa',
    notes: 'Rotate weekly for even growth',
    imageUrl: 'https://example.com/plant.jpg',
    wateringFrequency: 7,
    inferredWateringFrequency: 7,
    nextWateringDate: new Date('2026-03-17T12:00:00.000Z'),
  },
  'user-456'
);
```

With basic error handling:

```tsx
try {
  await updatePlant(plantId, values, userId);
} catch (error) {
  console.error('Failed to update plant:', error);
}
```

## Edge Cases

### Omitted optional fields

Fields not included in `plantData` are not part of the Firestore update payload.

### Empty payload

If `plantData` is empty, the function still calls `updateDoc` with an empty object.

### Watering values

`wateringFrequency`, `inferredWateringFrequency`, and `nextWateringDate` are not computed by this service. Callers must provide any derived values they want to store.

### Unknown thrown values

If a non-`Error` value is thrown internally, it is converted to `new Error('Unknown error')`.
