# `IconTile`

## Purpose

`IconTile` displays an icon inside a circular, colored background.
It is used to visually emphasize an icon or represent a category, type, or status.
The component is purely visual and does not provide interaction on its own.

## Props

| Prop    | Type                                                                                                      | Required | Default   | Description                                                     |
| ------- | --------------------------------------------------------------------------------------------------------- | -------- | --------- | --------------------------------------------------------------- |
| `Icon`  | `React.ElementType`                                                                                       | Yes      | —         | The icon component to render inside the tile                    |
| `color` | `'black' \| 'red' \| 'orange' \| 'yellow' \| 'lime' \| 'green' \| 'cyan' \| 'blue' \| 'purple' \| 'pink'` | No       | `'black'` | Background color variant for the tile                           |
| `label` | `string`                                                                                                  | Yes      | —         | Text used for the tile `title` tooltip and `data-testid` suffix |

## Accessibility

`IconTile` is currently decorative and sets `aria-hidden="true"` on the tile container.
The `label` is not exposed as an accessible name; it is used for tooltip text (`title`).

## Example Usage

```jsx
import IconTile from '../components/IconTile';
import { Leaf } from 'lucide-react';

<IconTile Icon={Leaf} color="green" label="Plant category" />;
```

## Using local SVG files

When using a local `.svg`, import it as a React component with `?react`, and ensure paths use `fill="currentColor"` (or `stroke="currentColor"`) so `iconColor` can control it.

```jsx
import FertilizerIcon from '../assets/icons/fertilizer.svg?react';

<IconTile Icon={FertilizerIcon} color="pink" label="Fertilizer" />;
```
