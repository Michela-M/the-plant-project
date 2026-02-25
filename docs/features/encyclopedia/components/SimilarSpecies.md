# `SimilarSpecies` Component

## Purpose

The **SimilarSpecies** component renders a linked preview card for one related species. It fetches the species details by ID and displays image, family, common name, and tags.

## Props

| Prop        | Type     | Required | Description                                |
| ----------- | -------- | -------- | ------------------------------------------ |
| `speciesId` | `string` | yes      | Species document ID used to fetch details. |

## Behavior Notes

- On mount (and when `speciesId` changes), calls `getSpeciesDetails(speciesId)`.
- If `speciesId` is empty, fetch is skipped.
- On success, renders fetched values:
  - image (`similarSpecies.image`)
  - family (`similarSpecies.family`)
  - common name (`similarSpecies.commonName`)
  - tags (`similarSpecies.tags` rendered with `Tag`)
- While data is not yet available, fallback values are shown:
  - image placeholder URL
  - `Unknown Family`
  - `Unknown`
  - alt text `Plant Image`
- On fetch failure, shows toast error via `showError`.
- Entire card is wrapped in a route link to `/species/{speciesId}`.

## Example Usage

```jsx
<SimilarSpecies speciesId="species-123" />
```
