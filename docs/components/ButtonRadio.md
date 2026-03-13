# `ButtonRadio`

## Purpose

The **ButtonRadio** component provides a controlled, segmented selection mechanism. It can render either a row of icon buttons or a row of text labels and highlights the currently selected option. The parent component owns the state.

`ButtonRadio` renders a semantic radio group (`fieldset` + `radio` inputs) for accessibility.

## Props

| Prop            | Type                      | Required | Description                                                      |
| --------------- | ------------------------- | -------- | ---------------------------------------------------------------- |
| `icons`         | `IconOption[]`            | yes\*    | Icon options to display. Provide this or `labels` (exactly one). |
| `labels`        | `string[]`                | yes\*    | Text options to display. Provide this or `icons` (exactly one).  |
| `selectedIndex` | `number`                  | yes      | Index of the currently selected option.                          |
| `onChange`      | `(index: number) => void` | yes      | Callback fired when the user selects a different option.         |
| `groupLabel`    | `string`                  | yes      | Accessible label for the radio group (rendered in the legend).   |
| `disabled`      | `boolean`                 | no       | Disables all options and applies disabled styling when `true`.   |

`*` Exactly one of `icons` or `labels` must be provided.

### IconOption

```jsx
interface IconOption {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  id?: string | number;
}
```

## Example Usage

```jsx
const icons = [
  { Icon: SunIcon, label: 'Sunny', id: 'sun' },
  { Icon: CloudIcon, label: 'Cloudy', id: 'cloud' },
  { Icon: RainIcon, label: 'Rainy', id: 'rain' },
];

const [selected, setSelected] = useState(0);

<ButtonRadio
  icons={icons}
  selectedIndex={selected}
  onChange={setSelected}
  groupLabel="Weather options"
/>;

const labels = ['Daily', 'Weekly', 'Monthly'];
const [selectedLabel, setSelectedLabel] = useState(0);

<ButtonRadio
  labels={labels}
  selectedIndex={selectedLabel}
  onChange={setSelectedLabel}
  groupLabel="Reminder cadence"
  disabled={false}
/>;
```

## Notes

- Missing truncation for long labels

- Missing tooltip on icon hover using labels
