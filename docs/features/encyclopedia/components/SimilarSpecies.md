# `SimilarSpecies` Component

## Purpose

The **SimilarSpecies** component renders a linked preview card for one related species. It fetches the species details by ID and displays image, family, common name, and tags.

## Props

| Prop        | Type     | Required | Description                                |
| ----------- | -------- | -------- | ------------------------------------------ |
| `speciesId` | `string` | yes      | Species document ID used to fetch details. |

## Behavior Notes

- On mount (and when `speciesId` changes), the component uses the `useSpeciesDetails` hook to fetch species details by ID.
- If `speciesId` is empty, fetch is skipped (handled by the hook).
- On success, renders fetched values:
  - image (`similarSpecies.image`)
  - family (`similarSpecies.family`)
  - common name (`similarSpecies.commonName`)
  - tags (`similarSpecies.tags` rendered with `Tag`)
- While data is not yet available, fallback values are shown:
  - image placeholder URL
  - `Unknown Family`
  - `Unknown`
  - placeholder alt text: `No photo available`
- On fetch failure, shows toast error via `showError` (from the toast context).
- Entire card is wrapped in a route link to `/species/{speciesId}`.

## Accessibility Notes

- Image alt text is generated internally and is not configurable through props.
- Current alt behavior:
  - Real image: `{commonName} ({scientificName}) image`.
  - Placeholder image: `No photo available`.

## Example Usage

```jsx
<SimilarSpecies speciesId="species-123" />
```
