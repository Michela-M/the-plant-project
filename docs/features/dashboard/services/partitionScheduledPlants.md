# `partitionScheduledPlants` Service

## Description

`partitionScheduledPlants` splits scheduled plants into two buckets for dashboard rendering:

- `todayOrOverdue` — plants with `nextWateringDate` on or before the end of today
- `afterToday` — plants with `nextWateringDate` after today

Plants without a `nextWateringDate` are ignored.

The function accepts an optional `now` argument to make date-based behavior deterministic in tests.

## Parameters

| Name     | Type               | Required | Description                                                              |
| -------- | ------------------ | -------- | ------------------------------------------------------------------------ |
| `plants` | `ScheduledPlant[]` | Yes      | Array of scheduled plants to partition                                   |
| `now`    | `Date`             | No       | Reference date used to compute “end of today” (defaults to `new Date()`) |

## Return Value

The function returns:

- `{ todayOrOverdue: ScheduledPlant[]; afterToday: ScheduledPlant[] }`

Return shape:

```tsx
{
	todayOrOverdue: ScheduledPlant[];
	afterToday: ScheduledPlant[];
}
```

## Usage

```tsx
import { partitionScheduledPlants } from '../services/partitionScheduledPlants';

const { todayOrOverdue, afterToday } = partitionScheduledPlants(plants);
```

For deterministic tests:

```tsx
const now = new Date('2026-03-02T10:00:00');
const result = partitionScheduledPlants(plants, now);
```

## Edge Cases

### Missing `nextWateringDate`

Plants with `nextWateringDate: null` are skipped and not included in either bucket.

### Overdue handling

Any plant with `nextWateringDate` before today is intentionally included in `todayOrOverdue`.

### Boundary behavior

The cutoff is the end of the current day (`23:59:59.999` local time), so plants scheduled any time today are included in `todayOrOverdue`.
