# `Modal`

## Purpose

`Modal` renders a centered dialog overlay with a title, content, and optional action buttons.
Use it for confirmation flows, acknowledgements, and non-blocking informational content.

## Props

| Prop        | Type                                                                 | Required | Description                                                                |
| ----------- | -------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------- |
| `title`     | `string`                                                             | Yes      | Title text shown at the top of the modal.                                  |
| `children`  | `React.ReactNode`                                                    | Yes      | Modal body content.                                                        |
| `onClose`   | `() => void`                                                         | Yes      | Called when the user dismisses the modal or clicks the close icon.         |
| `type`      | `'passive' \| 'transactional' \| 'destructive' \| 'acknowledgement'` | Yes      | Controls which action buttons appear and their tone.                       |
| `label`     | `string`                                                             | No       | Custom label for the confirm/OK button. Defaults to `"Confirm"` or `"OK"`. |
| `onConfirm` | `() => void`                                                         | No       | Called when the confirm/OK button is clicked. Defaults to `onClose`.       |

### Button behavior

- `passive`: no action buttons, only the close icon.
- `transactional`: shows Cancel and Confirm buttons.
- `destructive`: shows Cancel and Confirm buttons with error tone.
- `acknowledgement`: shows a single OK button.

## Example Usage

```tsx
import Modal from '../components/Modal';

<Modal
  title="Delete plant"
  type="destructive"
  label="Delete"
  onClose={() => setOpen(false)}
  onConfirm={handleDelete}
>
  <p>Are you sure you want to delete this plant?</p>
</Modal>;
```
