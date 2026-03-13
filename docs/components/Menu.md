# `Menu`

## Purpose

`Menu` provides a floating container for contextual actions, typically triggered by a button or icon.
It automatically sizes itself based on its content, up to a maximum width, while maintaining a consistent minimum width.
This ensures long labels don’t break layout while still allowing short labels to feel compact.

The component is purely presentational and expects `MenuItem` children.

## Props

| Prop       | Type            | Required | Description                                                            |
| ---------- | --------------- | -------- | ---------------------------------------------------------------------- |
| `label`    | string          | Yes      | Accessible name applied to the menu container via `aria-label`.        |
| `children` | React.ReactNode | Yes      | One or more `MenuItem` components to render inside the menu container. |

## Example Usage

(see below)

# `MenuItem`

## Purpose

`MenuItem` represents a single actionable row inside a Menu.
It supports:

- Long labels with automatic truncation
- Optional descriptions for secondary context
- Disabled state
- Danger variant for destructive actions

## Props

| Prop          | Type       | Required | Description                                                     |
| ------------- | ---------- | -------- | --------------------------------------------------------------- |
| `label`       | string     | Yes      | Primary text displayed for the menu item.                       |
| `description` | string     | No       | Optional secondary text shown below the label.                  |
| `onClick`     | () => void | No       | Callback fired when the item is clicked.                        |
| `disabled`    | boolean    | No       | Applies disabled visual styles and sets `aria-disabled="true"`. |
| `danger`      | boolean    | No       | Styles the item as a destructive action (e.g., red text).       |

## Accessibility Notes

- `Menu` renders with `role="menu"` and uses the required `label` prop for `aria-label`.
- `MenuItem` renders as a native `button` with `role="menuitem"`.
- `danger` adds screen-reader-only context: `(destructive action)`.
- `disabled` currently communicates disabled state with styles and `aria-disabled`, but still invokes `onClick` if provided.

## Example Usage

```jsx
<Menu label="Plant actions">
  <MenuItem
    label="Rename"
    description="Change the item’s display name"
    onClick={() => {}}
  />

  <MenuItem
    label="Move to folder with a very long name that should truncate nicely"
    onClick={() => {}}
  />

  <MenuItem label="Archive" disabled description="Unavailable for this item" />

  <MenuItem label="Delete permanently" danger onClick={() => {}} />
</Menu>
```
