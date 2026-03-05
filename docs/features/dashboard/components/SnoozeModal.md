# `SnoozeModal`

## Purpose

The **SnoozeModal** component lets a user postpone watering reminders for a plant from the dashboard.

It calculates the next watering date based on a selected snooze option and updates the plant through `updateNextWatering`.

## Props

| Prop                 | Type                      | Required | Description                                               |
| -------------------- | ------------------------- | -------- | --------------------------------------------------------- |
| `plantId`            | `string`                  | yes      | Plant id for the reminder update.                         |
| `setShowSnoozeModal` | `(show: boolean) => void` | yes      | Controls visibility; called with `false` on close/submit. |

## Options

| Option              | Internal Value | Resulting `nextWateringDate`                          |
| ------------------- | -------------- | ----------------------------------------------------- |
| Remind me tomorrow  | `'1'`          | Current date/time + 1 day                             |
| Remind me in X days | `'2'`          | Current date/time + `snoozeDays` (when valid and > 0) |
| Don't remind me     | `'3'`          | `null`                                                |

## Behavior Notes

- Initial form values:
  - `snoozeOption: '1'`
  - `snoozeDays: '2'`
- Focusing or changing the days input automatically selects option `'2'`.
- On submit:
  - if authenticated user exists, calls `updateNextWatering(plantId, user.id, nextWateringDate)`
  - closes modal after submit
  - shows success toast: `Watering reminder snoozed successfully!`
- If there is no authenticated user, it closes the modal and skips update.
- If there is no authenticated user, it also shows error toast: `User not authenticated. Please log in again.`

## Example Usage

```tsx
<SnoozeModal plantId="plant-123" setShowSnoozeModal={setShowSnoozeModal} />
```
