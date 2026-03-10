# `updateWateringDates`

## Purpose

`updateWateringDates` computes watering-related plant metadata for a new water care event before that event is persisted.

It centralizes date ordering and frequency calculation logic so components/services can pass a complete watering payload into `addCareEntry`.

## Signature

```ts
updateWateringDates(plantId: string, userId: string, date: Date): Promise<{
  inferredWateringFrequency: number;
  lastWateredDate: Date | null;
  secondLastWateredDate: Date | null;
  nextWateringDate: Date | null;
}>
```

## Inputs

| Name      | Type     | Required | Description                          |
| --------- | -------- | -------- | ------------------------------------ |
| `plantId` | `string` | Yes      | Plant document id.                   |
| `userId`  | `string` | Yes      | User id used to fetch plant details. |
| `date`    | `Date`   | Yes      | New water care date being applied.   |

## Returned Fields

| Field                       | Type           | Description                                                                           |
| --------------------------- | -------------- | ------------------------------------------------------------------------------------- |
| `inferredWateringFrequency` | `number`       | Frequency in days derived from two most recent watering dates (or existing defaults). |
| `lastWateredDate`           | `Date \| null` | Most recent watering date after applying the new event.                               |
| `secondLastWateredDate`     | `Date \| null` | Second most recent watering date after applying the new event.                        |
| `nextWateringDate`          | `Date \| null` | Next due date based on explicit `wateringFrequency` first, then inferred frequency.   |

## Behavior Notes

- Fetches plant details via `getPlantDetails(plantId, userId)`.
- Normalizes Firestore date-like values with `firebaseTimestampToDate`.
- Updates the `lastWateredDate` and `secondLastWateredDate` ordering with the incoming `date`.
- Computes inferred frequency with `calculateWateringFrequency` when both watering dates are present and ordered.
- Computes next date with `calculateNextWateringDate`:
  - uses explicit `wateringFrequency` when non-zero
  - otherwise uses `inferredWateringFrequency` when non-zero
  - otherwise leaves `nextWateringDate` as `null` (or existing value if present)

## Example

```ts
const wateringUpdateData = await updateWateringDates(
  plantId,
  userId,
  new Date('2026-03-10T12:00:00.000Z')
);

await addCareEntry({
  careType: 'water',
  date: new Date('2026-03-10T12:00:00.000Z'),
  plantId,
  userId,
  ...wateringUpdateData,
});
```

## Edge Cases

- If existing date fields are missing/invalid, they normalize to `null`.
- If the new date is older than `lastWateredDate` but newer than `secondLastWateredDate`, only `secondLastWateredDate` is replaced.
- If both explicit and inferred frequencies are `0`, no new `nextWateringDate` is computed.
