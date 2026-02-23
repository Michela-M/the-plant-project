# `Radio`

## Purpose

The `Radio` component set provides a controlled radio input UI composed of:

- `RadioGroup` for grouping and layout
- `RadioButton` for each selectable option

It is used when only one option should be selected at a time.

## Components

### `RadioGroup`

Wraps one or more `RadioButton` children and controls the layout direction.

#### Props

| Prop       | Type                         | Required | Default      | Description                                 |
| ---------- | ---------------------------- | -------- | ------------ | ------------------------------------------- |
| `label`    | `string`                     | No       | —            | Group label text and accessible group label |
| `children` | `React.ReactNode`            | Yes      | —            | Radio button elements                       |
| `layout`   | `'vertical' \| 'horizontal'` | No       | `'vertical'` | Layout direction for the button list        |

### `RadioButton`

Renders a single radio input with a label.

#### Props

| Prop       | Type                      | Required | Default | Description                                            |
| ---------- | ------------------------- | -------- | ------- | ------------------------------------------------------ |
| `label`    | `string`                  | Yes      | —       | Visible label for the option                           |
| `value`    | `string`                  | Yes      | —       | Option value used by `id` and passed to `onChange`     |
| `checked`  | `boolean`                 | Yes      | —       | Whether this option is currently selected              |
| `onChange` | `(value: string) => void` | Yes      | —       | Called when the option is selected                     |
| `disabled` | `boolean`                 | No       | `false` | Disables selection and applies disabled visual styling |

## Example Usage

```tsx
import { useState } from 'react';
import RadioGroup, { RadioButton } from '@components/Radio';

export default function CareTypePicker() {
  const [careType, setCareType] = useState('water');

  return (
    <RadioGroup label="Care type" layout="horizontal">
      <RadioButton
        label="Water"
        value="water"
        checked={careType === 'water'}
        onChange={setCareType}
      />
      <RadioButton
        label="Fertilize"
        value="fertilize"
        checked={careType === 'fertilize'}
        onChange={setCareType}
      />
      <RadioButton
        label="Repot"
        value="repot"
        checked={careType === 'repot'}
        onChange={setCareType}
      />
    </RadioGroup>
  );
}
```

## Notes

- This is a controlled component; parent state determines which option is selected.
- The `value` prop is used for both the input's `id` and passed to the `onChange` callback, so it should be unique within the group.
- The `label` prop on `RadioGroup` is important for accessibility as it provides a group label for screen readers.
