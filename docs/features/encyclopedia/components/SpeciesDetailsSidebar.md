# `SpeciesDetailsSidebar` Component

## Purpose

The **SpeciesDetailsSidebar** component renders supplementary species information alongside the main content. It includes the hero image, metadata (other names and type), characteristic badges, and related species links.

## Props

| Prop             | Type                 | Required | Description                                          |
| ---------------- | -------------------- | -------- | ---------------------------------------------------- |
| `speciesDetails` | `SpeciesDetailsData` | yes      | Species object used to populate all sidebar content. |

### `speciesDetails` fields used

- `image`
- `commonName`
- `otherNames`
- `type`
- `characteristics`
- `similarSpecies`

## Behavior Notes

- Main image uses `speciesDetails.image` or falls back to a placeholder URL when missing.
- Main image alt text is generated internally in this component and passed to `ImagePreview`.
- Current alt behavior:
  - Real image: `{commonName} image`.
  - Placeholder image: `No photo available for {commonName}`.
- `otherNames` and `type` are rendered as comma-separated strings.
- Characteristics section renders six `CharacteristicBadge` items:
  - `difficulty`
  - `toxicity`
  - `maintenance`
  - `light`
  - `pruning`
  - `propagation`
- Similar species section:
  - Shows up to 3 items via `similarSpecies.slice(0, 3)`.
  - Renders each item with `SimilarSpecies`.
  - Shows `No similar species listed.` when none exist.

## Example Usage

```jsx
<SpeciesDetailsSidebar speciesDetails={speciesDetails} />
```
