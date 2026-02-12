# `Spinner` & `InlineSpinner`

## Purpose

`Spinner` renders a centered loading indicator for full-page or section loading states.
`InlineSpinner` is a compact variant for inline or button-level loading.

## Props

### Spinner

`Spinner` accepts no props.

### InlineSpinner

| Prop    | Type                                                    | Required | Description                                                          |
| ------- | ------------------------------------------------------- | -------- | -------------------------------------------------------------------- |
| `color` | `'stone-50' \| 'green-600' \| 'green-800' \| 'red-800'` | No       | Tailwind text color used for the spinner. Defaults to `"green-800"`. |

## Example Usage

```tsx
import Spinner, { InlineSpinner } from '../components/Spinner';

function Screen() {
  return (
    <div>
      <Spinner />
      <button className="inline-flex items-center gap-2">
        Saving
        <InlineSpinner color="green-600" />
      </button>
    </div>
  );
}
```
