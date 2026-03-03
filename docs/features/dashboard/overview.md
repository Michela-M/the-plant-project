# `Dashboard` Feature Overview

## Description

The dashboard feature gives authenticated users a care-focused view of plants that have watering tracking enabled.
It surfaces plants due today (or overdue) as cards and groups upcoming watering reminders by date.

## Scope

This feature currently includes:

- Dashboard route and page (`/dashboard`)
- Firestore-backed loading of scheduled plants for the current user
- Partitioning logic for today/overdue vs after-today reminders
- “Today” card grid for immediate care actions
- “Upcoming Care” grouped list by date with relative labels
- Loading and basic empty states

## Routes

| Route        | Component   | Purpose                                  |
| ------------ | ----------- | ---------------------------------------- |
| `/dashboard` | `Dashboard` | Show scheduled care reminders by timing. |

## Main Flow

### Load Dashboard Data

1. `Dashboard` reads the signed-in user from auth context.
2. It calls `getScheduledPlants(userId)`.
3. While loading, `Spinner` is shown.
4. On success, plants are split using `partitionScheduledPlants`.
5. On failure, a toast is shown with `Error loading plants`.

### Partition Scheduled Plants

1. `partitionScheduledPlants` computes `endOfToday` from the current local date/time.
2. Plants with `nextWateringDate <= endOfToday` go to `todayOrOverdue`.
3. Plants with `nextWateringDate > endOfToday` go to `afterToday`.
4. Plants without `nextWateringDate` are ignored for both sections.

### Render Today / Overdue

1. `TodayCareSection` renders only when `todayOrOverdue.length > 0`.
2. Each plant is shown as a `ScheduleCard` with species, name, image, last watering, and watering frequency.
3. Card actions (`Watered`, `Snooze`) are currently placeholder UI actions.

### Render Upcoming Care

1. `UpcomingCareSection` groups `afterToday` plants by calendar date (`YYYY-MM-DD`).
2. Each group renders a heading with absolute date and relative date label (e.g., `Friday, 6 Mar (in 3 days)`).
3. Each plant renders as a `ScheduleListItem` row.
4. If there are no upcoming items, it shows `No upcoming care.`.

## Display Behavior

- Dashboard heading uses shared typography (`H1`) and includes a `New entry` button (currently placeholder).
- Species names in schedule components use `Callout` styling with muted text color.
- Missing plant images fall back to a placeholder URL.
- Last watered date displays relative text via `formatRelativeDate`, or `N/A` when missing.
- Frequency display behavior:
  - Uses `wateringFrequency` when value is greater than `0`.
  - Falls back to `inferredWateringFrequency` otherwise.

## Data Source (Current State)

- Data is loaded from Firestore path: `users/{userId}/plants`.
- Query filters and sorting:
  - `where('trackWatering', '==', true)`
  - `orderBy('nextWateringDate', 'asc')`
- Field mapping in `getScheduledPlants` normalizes values to safe defaults.

Current dashboard model fields:

- `id: string`
- `imageUrl: string | null`
- `name: string`
- `species: string`
- `wateringFrequency: number | null`
- `nextWateringDate: Date | null`
- `lastWateredDate: Date | null`
- `inferredWateringFrequency: number | null`

## Dependencies

- `firebase/firestore` for scheduled-plant query
- Auth context (`useAuth`) for current user id
- Toast context (`useToast`) for async error feedback
- Shared components (`Spinner`, `Button`, `Typography`)
- `formatRelativeDate` utility for relative day labels

## Error Handling

- Dashboard fetch failures surface a toast with a specific title and details when available.
- Unknown errors fall back to `Unknown error`.
- Missing values from Firestore are normalized in the service layer to avoid rendering crashes.

## Current Limitations

- `Watered`, `Snooze`, and `New entry` actions are UI placeholders and not wired to persistence workflows.
- Today/overdue section does not currently render an explicit empty-state message when there are no due plants.
- Options action in upcoming list item (`IconButton`) is currently visual-only.

## Access Control

- `/dashboard` is wrapped in `ProtectedRoute`; unauthenticated users cannot access it directly.

## Related Files

- `src/features/dashboard/pages/Dashboard.tsx`
- `src/features/dashboard/components/TodayCareSection.tsx`
- `src/features/dashboard/components/UpcomingCareSection.tsx`
- `src/features/dashboard/components/ScheduleCard.tsx`
- `src/features/dashboard/components/ScheduleListItem.tsx`
- `src/features/dashboard/services/getScheduledPlants.tsx`
- `src/features/dashboard/services/partitionScheduledPlants.ts`
- `src/utils/formatRelativeDate.tsx`
- `src/App.tsx`
