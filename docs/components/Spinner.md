# `Spinner` & `InlineSpinner`

## Purpose

`Spinner` renders a centered loading indicator for full-page or section loading states.
`InlineSpinner` is a compact variant for inline or button-level loading.

## Props

### Spinner

| Prop    | Type     | Required | Description                                                  |
| ------- | -------- | -------- | ------------------------------------------------------------ |
| `label` | `string` | No       | Screen-reader-only loading text. Defaults to `"Loading..."`. |

### InlineSpinner

| Prop    | Type                                                    | Required | Description                                                          |
| ------- | ------------------------------------------------------- | -------- | -------------------------------------------------------------------- |
| `color` | `'stone-50' \| 'green-600' \| 'green-800' \| 'red-800'` | No       | Tailwind text color used for the spinner. Defaults to `"green-800"`. |
| `label` | `string`                                                | No       | Screen-reader-only loading text. Defaults to `"Loading..."`.         |

## Example Usage

```tsx
import Spinner, { InlineSpinner } from '../components/Spinner';

function Screen() {
  return (
    <div>
      <Spinner label="Loading dashboard" />
      <button className="inline-flex items-center gap-2">
        Saving
        <InlineSpinner color="green-600" label="Saving plant" />
      </button>
    </div>
  );
}
```
