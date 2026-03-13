# `PasswordToggleIcon`

## Purpose

`PasswordToggleIcon` is a compact icon-only toggle used in password fields.
It switches between "show password" and "hide password" states and delegates the state update to the parent via `onToggle`.

## Props

| Prop       | Type         | Required | Description                                                 |
| ---------- | ------------ | -------- | ----------------------------------------------------------- |
| `visible`  | `boolean`    | yes      | Current visibility state. `true` means password is visible. |
| `onToggle` | `() => void` | yes      | Callback fired when the user activates the toggle button.   |

## Accessibility Notes

- Renders a native button through `IconButton`.
- Accessible label is state-dependent:
  - `Show password` when `visible` is `false`
  - `Hide password` when `visible` is `true`

## Example Usage

```tsx
<PasswordToggleIcon
  visible={showPassword}
  onToggle={() => setShowPassword((prev) => !prev)}
/>
```
