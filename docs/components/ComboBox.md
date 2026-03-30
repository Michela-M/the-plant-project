# ComboBox Component

A flexible, accessible dropdown input with search and free-typing support. Use for selecting or searching from a list, or allowing custom user input.

## Features

- Controlled component: parent manages value and options
- Search/filter as you type
- Supports custom (free-typed) values
- Optionally displays images and descriptions
- Clear button for quick reset
- Keyboard and screen reader accessible

## Props

| Name                | Type                                                        | Required | Description                                                     |
| ------------------- | ----------------------------------------------------------- | -------- | --------------------------------------------------------------- |
| `options`           | `ComboBoxOption[]`                                          | Yes      | List of options to display. Each option: `{ id, name, image? }` |
| `value`             | `string`                                                    | No       | Current input value (controlled).                               |
| `onChange`          | `(value: string) => void`                                   | No       | Called when input value changes (typing or selection).          |
| `onSelectionChange` | `(selection: { id: string \| null, name: string }) => void` | No       | Called when an option is selected or cleared.                   |
| `label`             | `string`                                                    | No       | Input label for accessibility.                                  |
| `placeholder`       | `string`                                                    | No       | Input placeholder text.                                         |
| `onBlur`            | `() => void`                                                | No       | Called when input loses focus.                                  |
| `readOnly`          | `boolean`                                                   | No       | If true, disables typing; user can only select from dropdown.   |

## Usage

```tsx
import ComboBox, { type ComboBoxOption } from '@components/ComboBox';

const options: ComboBoxOption[] = [
  { id: '1', name: 'Apple', image: '/apple.png' },
  { id: '2', name: 'Banana', image: '/banana.png' },
  { id: '3', name: 'Cherry' },
];

function Example() {
  const [value, setValue] = useState('');
  const [selected, setSelected] = useState<{ id: string | null; name: string }>(
    { id: null, name: '' }
  );

  return (
    <ComboBox
      label="Fruit"
      options={options}
      value={value}
      onChange={setValue}
      onSelectionChange={setSelected}
      placeholder="Select or type a fruit"
    />
  );
}

// To disable typing and only allow selection:
<ComboBox
  label="Fruit"
  options={options}
  value={value}
  onChange={setValue}
  onSelectionChange={setSelected}
  readOnly
  placeholder="Select a fruit"
/>;
```

## Customization

- To show images, provide `image` in each option.
- To show descriptions, provide `description` in each option.
- To allow only selection (no free typing), use the `readOnly` prop.
- For multi-use (species, plants, etc.), just change the `options` prop.

## Accessibility

- Input is labeled and uses `role="combobox"`.
- Dropdown uses `aria-controls` and `aria-expanded`.
- Clear button is keyboard and screen reader accessible.
