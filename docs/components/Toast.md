# `Toast`

A lightweight, dismissible notification component for displaying brief feedback messages (info, success, warning, or error).
The toast appears in the bottom-right corner of the screen and automatically closes after a short delay.

## Purpose

Use Toast to surface non-blocking feedback to users, such as:

- Form submission results
- API success or error messages
- Warnings or informational notices

The component:

- Supports four visual types (info, success, warning, error)
- Auto-dismisses after 4 seconds
- Pauses auto-dismiss while hovered anywhere over the toast
- Pauses auto-dismiss while focus is inside the toast (for example, on the close button)
- Can be manually dismissed via a close button
- Is controlled externally via open and onClose

## Accessibility Notes

- Uses `role="status"` with `aria-live="polite"` for `info` and `success` toasts.
- Uses `role="alert"` with `aria-live="assertive"` for `warning` and `error` toasts.
- Includes a screen-reader-only prefix announcing the toast type before the message.

## Props

| Prop      | Type                                          | Required | Default  | Description                                                 |
| --------- | --------------------------------------------- | -------- | -------- | ----------------------------------------------------------- |
| `message` | `string`                                      | Yes      | —        | Primary text displayed in the toast                         |
| `detail`  | `string`                                      | No       | —        | Optional secondary text shown below the message             |
| `type`    | `'info' \| 'success' \| 'warning' \| 'error'` | No       | `'info'` | Controls the icon and background color                      |
| `open`    | `boolean`                                     | Yes      | —        | Whether the toast is visible                                |
| `onClose` | `() => void`                                  | Yes      | —        | Callback fired when the toast is dismissed (auto or manual) |

## Example Usage

### Basic toast

```jsx
<Toast open={open} onClose={onClose} message="Something happened" />
```

### Success toast

```jsx
<Toast
  open={open}
  onClose={onClose}
  type="success"
  message="Profile updated successfully"
/>
```

### With detail text

```jsx
<Toast
  open={open}
  onClose={onClose}
  type="info"
  message="Changes saved"
  detail="Your settings were updated."
/>
```
