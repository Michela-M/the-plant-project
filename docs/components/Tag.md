# `Tag`

## Purpose

The **Tag** component displays a short label with a color‑coded background. It is used to represent attributes, statuses, or categories in a compact, visually consistent way.

## Props

| Prop    | Type                                                                                 | Required | Default  | Description                                       |
| ------- | ------------------------------------------------------------------------------------ | -------- | -------- | ------------------------------------------------- |
| `label` | `string`                                                                             | yes      | -        | The text displayed inside the tag.                |
| `color` | `'grey' \| 'red' \| 'orange' \| 'yellow' \| 'green' \| 'blue' \| 'purple' \| 'pink'` | no       | `'grey'` | Determines the background and text color styling. |

## Example Usage

```jsx
<Tag label="Low Maintenance" color="green" />
<Tag label="Air Purifying" color="blue" />
<Tag label="Drought Tolerant" />
```
