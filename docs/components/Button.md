# `Button`

## Purpose

**Buttons** are used to trigger actions. They should clearly communicate what will happen when a user interacts with them.

## Props

| Prop        | Type                              | Required | Default     | Description                                 |
| ----------- | --------------------------------- | -------- | ----------- | ------------------------------------------- |
| `label`     | `string`                          | yes      | —           | Text displayed inside the button            |
| `icon`      | `ReactNode`                       | no       | —           | Optional icon displayed after the label     |
| `variant`   | `'filled' / 'outlined' / 'ghost'` | no       | `'filled'`  | Visual style of the button                  |
| `tone`      | `'primary' / 'destructive'`       | no       | `'primary'` | Color tone of the button                    |
| `type`      | `'button' / 'submit' / 'reset'`   | no       | `'button'`  | Native button type                          |
| `size`      | `'sm' / 'md'`                     | no       | `'md'`      | Button size                                 |
| `loading`   | `boolean`                         | no       | `false`     | Shows spinner and disables interaction      |
| `onClick`   | `() => void`                      | no       | —           | Click handler                               |
| `fullWidth` | `boolean`                         | no       | `false`     | If true, button takes full container width  |
| `ariaLabel` | `string`                          | no       | `label`     | Accessible name override for screen readers |

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
  tone="destructive"
  icon={<TrashIcon />}
  onClick={handleDelete}
/>
```

```jsx
<Button label="Save" loading={true} />
```

```jsx
<Button label="Save" ariaLabel="Save plant" />
```

# `Icon Button`

## Purpose

Icon Buttons are compact action buttons that display an icon instead of text.

## Props

| Prop      | Type                              | Required | Default     | Description                             |
| --------- | --------------------------------- | -------- | ----------- | --------------------------------------- |
| `icon`    | `ReactNode`                       | yes      | —           | Icon element rendered inside the button |
| `variant` | `'filled' / 'outlined' / 'ghost'` | no       | `'filled'`  | Visual style of the button              |
| `tone`    | `'primary' / 'destructive'`       | no       | `'primary'` | Color tone of the button                |
| `size`    | `'sm' / 'md'`                     | no       | `'md'`      | Button size                             |
| `loading` | `boolean`                         | no       | `false`     | Shows spinner and disables interaction  |
| `onClick` | `() => void`                      | no       | —           | Click handler                           |
| `label`   | `string`                          | yes      | —           | Accessible name used for `aria-label`   |

## Usage Example

```jsx
<IconButton icon={<TrashIcon />} onClick={handleDelete} label="Delete" />
```

```jsx
<IconButton variant="ghost" icon={<EditIcon />} label="Edit" size="sm" />
```

```jsx
<IconButton
  icon={<TrashIcon />}
  label="Delete plant"
  tone="destructive"
  loading={isDeleting}
/>
```
