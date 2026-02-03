# `ButtonRadio`

## Purpose

The **ButtonRadio** component provides a controlled, segmented selection mechanism. It can render either a row of icon buttons or a row of text labels and highlights the currently selected option. The parent component owns the state.

## Props

| Prop            | Type                      | Required | Description                                                          |
| --------------- | ------------------------- | -------- | -------------------------------------------------------------------- |
| `icons`         | `IconOption[]`            | no       | Array of icons to display. Provide this or `labels` (not both).      |
| `labels`        | `string[]`                | no       | Array of text labels to display. Provide this or `icons` (not both). |
| `selectedIndex` | `number`                  | yes      | Index of the currently selected option.                              |
| `onChange`      | `(index: number) => void` | yes      | Callback fired when the user selects a different option.             |
| `disabled`      | `boolean`                 | no       | Disables all buttons and applies disabled styling when `true`.       |

### IconOption

```jsx
interface IconOption {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  id?: string | number;
}
```

## Example Usage

```jsx
const icons = [
  { Icon: SunIcon, id: 'sun' },
  { Icon: CloudIcon, id: 'cloud' },
  { Icon: RainIcon, id: 'rain' },
];

const [selected, setSelected] = useState(0);

<ButtonRadio icons={icons} selectedIndex={selected} onChange={setSelected} />;

const labels = ['Daily', 'Weekly', 'Monthly'];
const [selectedLabel, setSelectedLabel] = useState(0);

<ButtonRadio
  labels={labels}
  selectedIndex={selectedLabel}
  onChange={setSelectedLabel}
  disabled={false}
/>;
```

## Notes

- Missing truncation for long labels

- Missing tooltip on icon hover using labels
