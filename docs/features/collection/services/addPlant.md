# `addPlant` Service

## Description

`addPlant` creates a new plant document in the user-scoped Firestore collection:

`users/{userId}/plants`

It accepts required identity fields plus optional plant metadata, applies defaults for omitted values, computes watering-related fields when possible, writes the plant document, and returns the constructed plant object.

Default behavior:

- `species` and `notes` default to `""`
- `wateringFrequency` defaults to `0`
- `lastWateredDate` defaults to `null`
- `inferredWateringFrequency` is derived from `wateringFrequency` (`0` when not provided)
- `secondLastWateredDate` is initialized as `null`

If both `wateringFrequency` and `lastWateredDate` are truthy, the service calculates `nextWateringDate` and sets `trackWatering` to `true`. Otherwise, `nextWateringDate` is `null` and `trackWatering` is `false`.

If `lastWateredDate` is provided, the service also creates an initial care entry in:

`users/{userId}/plants/{plantId}/careEntries`

with:

- `careType: "water"`
- `date: lastWateredDate`
- `notes: ""`

Both writes are queued in a single Firestore `writeBatch` and committed atomically.

## Parameters

| Name                          | Type           | Required | Description                                       |
| ----------------------------- | -------------- | -------- | ------------------------------------------------- |
| `plantData.name`              | `string`       | Yes      | Plant name                                        |
| `plantData.userId`            | `string`       | Yes      | User ID used to scope Firestore path              |
| `plantData.species`           | `string`       | No       | Plant species. Defaults to `""`                   |
| `plantData.notes`             | `string`       | No       | Freeform notes. Defaults to `""`                  |
| `plantData.wateringFrequency` | `number`       | No       | Planned watering interval (days). Defaults to `0` |
| `plantData.lastWateredDate`   | `Date \| null` | No       | Most recent watering date. Defaults to `null`     |

## Return Value

`Promise<PlantDoc>` where `PlantDoc` includes:

- `creationDate: Date`
- `name: string`
- `species: string`
- `notes: string`
- `wateringFrequency: number`
- `lastWateredDate: Date | null`
- `inferredWateringFrequency: number`
- `secondLastWateredDate: null`
- `nextWateringDate: Date | null`
- `trackWatering: boolean`

The promise rejects if plant creation, optional care-entry creation, or watering-date calculation fails.

## Usage

```tsx
import { addPlant } from '../services/addPlant';

const plant = await addPlant({
  name: 'Aloe Vera',
  userId: 'user-123',
  species: 'Aloe barbadensis miller',
  notes: 'Keep in bright indirect light',
  wateringFrequency: 7,
  lastWateredDate: new Date('2026-02-20'),
});

console.log(plant.nextWateringDate);
```

With basic error handling:

```tsx
try {
  await addPlant({
    name: values.name,
    userId,
    species: values.species,
    notes: values.notes,
    wateringFrequency: values.wateringFrequency,
    lastWateredDate: values.lastWateredDate,
  });
} catch (error) {
  console.error('Failed to add plant:', error);
}
```

## Edge Cases

### Missing optional fields

If `species`, `notes`, `wateringFrequency`, or `lastWateredDate` are omitted, defaults are applied so the created document has a consistent shape.

### `wateringFrequency` provided without `lastWateredDate`

`inferredWateringFrequency` is set from `wateringFrequency`, but `nextWateringDate` remains `null` and `trackWatering` remains `false`.

### `lastWateredDate` provided without `wateringFrequency`

`lastWateredDate` is stored, but no next watering date is calculated and watering tracking is not enabled.
An initial `water` care entry is still created.

### Both watering inputs provided

When both values are truthy, `nextWateringDate` is calculated using `calculateNextWateringDate` and `trackWatering` is enabled.

### Invalid `lastWateredDate`

If `lastWateredDate` is not a valid `Date` object while watering calculation is attempted, date calculation can throw and the service rejects.

### Firestore/network/permission errors

Errors from `writeBatch(...).commit()` are rethrown so callers can handle user feedback, retries, or telemetry.

### Atomic write behavior

Plant creation and optional initial water care entry are committed together in one batch. Either all writes succeed, or none are committed.

### Unknown thrown values

If a non-`Error` value is thrown internally, it is converted to `new Error('Unknown error')`.
