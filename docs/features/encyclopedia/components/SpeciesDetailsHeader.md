# `SpeciesDetailsHeader` Component

## Purpose

The **SpeciesDetailsHeader** component renders the top row of the species details page. It provides back navigation, shows species identity (family, common name, scientific name), and exposes two call-to-action buttons.

## Props

| Prop             | Type     | Required | Description                                |
| ---------------- | -------- | -------- | ------------------------------------------ |
| `commonName`     | `string` | yes      | Main species name shown in the page title. |
| `family`         | `string` | yes      | Displayed above the title in muted text.   |
| `scientificName` | `string` | yes      | Rendered in parentheses after common name. |

## Behavior Notes

- Back icon button navigates to `/encyclopedia` using `useNavigate`.
- Title is rendered as `{commonName} ({scientificName})`.
- Action buttons currently render as:
  - `Add to Collection` (filled)
  - `Quick Add` (outlined)
- Both action buttons currently use placeholder `onClick` handlers (`() => {}`).

## Example Usage

```jsx
<SpeciesDetailsHeader
  commonName="Snake Plant"
  family="Asparagaceae"
  scientificName="Dracaena trifasciata"
/>
```
