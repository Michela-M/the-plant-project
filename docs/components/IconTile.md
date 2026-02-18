# `IconTile`

## Purpose

`IconTile` displays an icon inside a circular, colored background.
It is used to visually emphasize an icon or represent a category, type, or status.
The component is purely visual and does not provide interaction on its own.

## Props

| Prop    | Type                                                                                                      | Required | Default   | Description                                                   |
| ------- | --------------------------------------------------------------------------------------------------------- | -------- | --------- | ------------------------------------------------------------- |
| `Icon`  | `React.ElementType`                                                                                       | Yes      | —         | The icon component to render inside the tile                  |
| `color` | `'black' \| 'red' \| 'orange' \| 'yellow' \| 'lime' \| 'green' \| 'cyan' \| 'blue' \| 'purple' \| 'pink'` | No       | `'black'` | Background color variant for the tile                         |
| `label` | `string`                                                                                                  | Yes      | —         | Accessible label describing the icon’s meaning (`aria-label`) |

## Example Usage

```jsx
import IconTile from '../components/IconTile';
import { Leaf } from 'lucide-react';

<IconTile Icon={Leaf} color="green" label="Plant category" />;
```
