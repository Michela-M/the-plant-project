# `Button`

## Purpose

**Buttons** are used to trigger actions. They should clearly communicate what will happen when a user interacts with them.

## Props

| Prop      | Type                              | Required | Default     | Description                             |
| --------- | --------------------------------- | -------- | ----------- | --------------------------------------- |
| `label`   | `string`                          | yes      | —           | Text displayed inside the button        |
| `icon`    | `ReactNode`                       | no       | —           | Optional icon displayed after the label |
| `variant` | `'filled' / 'outlined' / 'ghost'` | no       | `'filled'`  | Visual style of the button              |
| `tone`    | `'primary' / 'error'`             | no       | `'primary'` | Color tone of the button                |
| `type`    | `'button' / 'submit' / 'reset'`   | no       | `'button'`  | Native button type                      |
| `onClick` | `() => void`                      | no       | —           | Click handler                           |

## Example Usage

```jsx
<Button label="Save" onClick={handleSave} />
```

```jsx
<Button label="Cancel" variant="outlined" onClick={handleCancel} />
```

```jsx
<Button
  label="Delete"
  tone="error"
  icon={<TrashIcon />}
  onClick={handleDelete}
/>
```

# `Icon Button`

## Purpose

Icon Buttons are compact action buttons that display an icon instead of text.

## Props

| Prop      | Type                          | Required | Default    | Description                             |
| --------- | ----------------------------- | -------- | ---------- | --------------------------------------- |
| `icon`    | `ReactNode`                   | yes      | —          | Icon element rendered inside the button |
| `variant` | `'filled'/'outlined'/'ghost'` | no       | `'filled'` | Visual style of the button              |
| `onClick` | `() => void`                  | no       | —          | Click handler                           |
| `label`   | `string`                      | no       | -          | Aria label                              |

## Usage Example

```jsx
<IconButton icon={<TrashIcon />} onClick={handleDelete} label="Delete />
```

```jsx
<IconButton variant="ghost" icon={<EditIcon />} label="Edit" />
```
