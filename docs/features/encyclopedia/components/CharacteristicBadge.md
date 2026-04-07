# `CharacteristicBadge` Component

## Purpose

The **CharacteristicBadge** component displays a normalized species characteristic as a compact icon + text row. It maps each characteristic label and numeric value to user-facing copy and color semantics.

## Props

| Prop    | Type                                                                                   | Required | Description                                                           |
| ------- | -------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------- |
| `label` | `'difficulty' \| 'toxicity' \| 'maintenance' \| 'light' \| 'pruning' \| 'propagation'` | yes      | Characteristic category used to choose icon and value mapping.        |
| `value` | `number`                                                                               | yes      | Numeric characteristic value, normalized internally to the range 0-3. |

## Behavior Notes

- `value` is normalized to `0` when it is outside the range `0-3`.
- For non-toxicity categories, value `0` returns `null` (badge is hidden).
- For `toxicity`, value `0` still renders as `Non-toxic`.
- Icon mapping by label:
  - `difficulty` → `Star1`, `Star2`, `Star3` (mapped to values 1, 2, 3 respectively)
  - `toxicity` → `Skull` (for toxic) or `Cat` (for non-toxic)
  - `maintenance` → `Wrench`
  - `light` → `SunDim`, `SunMedium`, `Sun` (mapped to values 1, 2, 3 respectively)
  - `pruning` → `Secateurs`
  - `propagation` → `PlantFlask`
- Color is passed to `IconTile` and resolves to the corresponding tile background utility class.
- If a mapping does not provide an icon, the default icon is `Star3`

## Example Usage

```jsx
<CharacteristicBadge label="light" value={2} />
```
