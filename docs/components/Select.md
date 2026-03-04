# `Select`

## Purpose

`Select` is a reusable dropdown component for choosing one value from a list of string options.

It provides:

- A visible label with proper label-to-control association
- Controlled selection via `value` and `onSelect`
- Optional validation error messaging
- Optional `name`, `id`, and blur handling for form integrations

## Props

| Prop       | Type                                                   | Required | Default | Description                                                           |
| ---------- | ------------------------------------------------------ | -------- | ------- | --------------------------------------------------------------------- |
| `options`  | `string[]`                                             | Yes      | —       | List of options displayed in the dropdown                             |
| `onSelect` | `(option: string) => void`                             | Yes      | —       | Called with the selected option value when selection changes          |
| `label`    | `string`                                               | Yes      | —       | Label text shown above the select                                     |
| `name`     | `string`                                               | No       | —       | Native select `name` attribute                                        |
| `id`       | `string`                                               | No       | —       | Native select `id`; if omitted, falls back to `name`, then `label`    |
| `value`    | `string`                                               | No       | `''`    | Controlled selected value                                             |
| `error`    | `string`                                               | No       | —       | Error message shown below the field and error border styling applied  |
| `onBlur`   | `(event: React.FocusEvent<HTMLSelectElement>) => void` | No       | —       | Blur handler used by form libraries (for touched/validation behavior) |

## Example Usage

```tsx
import { useState } from 'react';
import Select from '@components/Select';

export default function PlantPicker() {
  const [selectedPlant, setSelectedPlant] = useState('');

  return (
    <Select
      label="Select plant"
      name="plant"
      options={['Monstera', 'Ficus', 'Pothos']}
      value={selectedPlant}
      onSelect={setSelectedPlant}
    />
  );
}
```

## Notes

- The first option is a disabled placeholder (`Select an option`) with value `""`.
- Keep this component controlled in forms by passing `value` and `onSelect`.
- If your options need separate labels and ids (for example `{ label, value }`), extend this component API to support object options.
