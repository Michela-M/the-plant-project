# `SpeciesCard` Component

## Purpose

The **SpeciesCard** component renders a compact card view of a species for grid-style browsing. It displays image, family, and common name, and wraps the card in navigation to the species details page.

## Props

| Prop         | Type     | Required | Description                                                    |
| ------------ | -------- | -------- | -------------------------------------------------------------- |
| `id`         | `string` | yes      | Used to build the details route `/species/{id}`.               |
| `imageUrl`   | `string` | no       | Species image URL. Falls back to placeholder when missing.     |
| `family`     | `string` | no       | Displays `Unknown Family` when missing.                        |
| `commonName` | `string` | no       | Displays `Unknown` when missing. Also used for image alt text. |

## Behavior Notes

- Entire card is wrapped in a `Link` to `/species/{id}`.
- Image fallback URL is used when `imageUrl` is empty.
- Image alt text is `commonName` or `Plant Image`.
- Includes a ghost `IconButton` with a plus icon.
- Icon container is hidden by default and shown on hover via `group-hover:opacity-100`.
- Icon button label is dynamic:
  - `Add {commonName} to collection` when `commonName` exists
  - `Add plant to collection` otherwise

## Example Usage

```jsx
<SpeciesCard
  id="species-1"
  imageUrl="https://example.com/snake-plant.jpg"
  family="Asparagaceae"
  commonName="Snake Plant"
/>
```
