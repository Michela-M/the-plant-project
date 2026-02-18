# `Menu`

## Purpose

`Menu` provides a floating container for contextual actions, typically triggered by a button or icon.
It automatically sizes itself based on its content, up to a maximum width, while maintaining a consistent minimum width.
This ensures long labels don’t break layout while still allowing short labels to feel compact.

The component is purely presentational and expects `MenuItem` children.

## Props

| Prop       | Type            | Required | Description                                                            |
| ---------- | --------------- | -------- | ---------------------------------------------------------------------- |
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

| Prop          | Type       | Required | Description                                               |
| ------------- | ---------- | -------- | --------------------------------------------------------- |
| `label`       | string     | Yes      | Primary text displayed for the menu item.                 |
| `description` | string     | No       | Optional secondary text shown below the label.            |
| `onClick`     | () => void | No       | Callback fired when the item is clicked.                  |
| `disabled`    | boolean    | No       | Disables the item and prevents interaction.               |
| `danger`      | boolean    | No       | Styles the item as a destructive action (e.g., red text). |

## Example Usage

```jsx
<Menu>
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
