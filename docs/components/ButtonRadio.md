# `ButtonRadio`

## Purpose

The **ButtonRadio** component provides a controlled, icon‑based radio selection mechanism. It renders a row of clickable icon buttons and highlights the currently selected option. The parent component owns the state.

## Props

| Prop            | Type                      | Required | Description                                                    |
| --------------- | ------------------------- | -------- | -------------------------------------------------------------- |
| `icons`         | `IconOption[]`            | yes      | Array of icons to display. Each icon must accept a color prop. |
| `selectedIndex` | `number`                  | yes      | Index of the currently selected icon.                          |
| `onChange`      | `(index: number) => void` | yes      | Callback fired when the user selects a different icon.         |

### IconOption

```jsx
interface IconOption {
  Icon: React.ComponentType<{ color: string }>;
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
```
