# ComboBox Component

A flexible, accessible dropdown input with search and free-typing support. Use for selecting or searching from a list, or allowing custom user input.

## Features

- Controlled component: parent manages value and options
- Search/filter as you type
- Supports custom (free-typed) values
- Optionally displays images and descriptions for each option
- Clear button and chevron icon for quick reset and dropdown toggle
- Keyboard and screen reader accessible

## Props

| Name                | Type                                     | Required | Description                                                                   |
| ------------------- | ---------------------------------------- | -------- | ----------------------------------------------------------------------------- |
| `options`           | `ComboBoxOption[]`                       | Yes      | List of options to display. Each option: `{ id, name, description?, image? }` |
| `value`             | `string`                                 | No       | Current input value (controlled).                                             |
| `onChange`          | `(value: string) => void`                | No       | Called when input value changes (typing or selection).                        |
| `onSelectionChange` | `(selection: ComboBoxSelection) => void` | No       | Called when an option is selected or cleared.                                 |
| `label`             | `string`                                 | No       | Input label for accessibility.                                                |
| `placeholder`       | `string`                                 | No       | Input placeholder text.                                                       |
| `onBlur`            | `() => void`                             | No       | Called when input loses focus.                                                |
| `readOnly`          | `boolean`                                | No       | If true, disables typing; user can only select from dropdown.                 |

## Usage

```tsx
import ComboBox from '@components/ComboBox';
import type {
  ComboBoxOption,
  ComboBoxSelection,
} from '@components/ComboBox/types';

const options: ComboBoxOption[] = [
  { id: '1', name: 'Apple', image: '/apple.png', description: 'A sweet fruit' },
  { id: '2', name: 'Banana', image: '/banana.png' },
  { id: '3', name: 'Cherry' },
];

function Example() {
  const [value, setValue] = useState('');
  const [selected, setSelected] = useState<ComboBoxSelection>({
    id: null,
    name: '',
  });

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

- To show images, provide `image` in each option object.
- To show descriptions, provide `description` in each option object.
- The clear button (X icon) appears when there is a value; the chevron icon appears when the input is empty.
- To allow only selection (no free typing), use the `readOnly` prop.

## Accessibility

- Input is labeled and uses `role="combobox"`.
- Dropdown uses `aria-controls` and `aria-expanded`.
- Clear and toggle buttons are keyboard and screen reader accessible.
- Option images and descriptions are accessible via alt text and visible labels.
