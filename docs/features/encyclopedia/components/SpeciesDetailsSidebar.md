# `SpeciesDetailsSidebar` Component

## Purpose

The **SpeciesDetailsSidebar** component renders supplementary species information alongside the main content. It includes the hero image, metadata (other names and type), characteristic badges, related species links, and the user's plants for that species.

## Props

| Prop             | Type                 | Required | Description                                          |
| ---------------- | -------------------- | -------- | ---------------------------------------------------- |
| `speciesDetails` | `SpeciesDetailsData` | yes      | Species object used to populate all sidebar content. |
| `userPlants`     | `Array<UserPlant>`   | yes      | List of the user's plants for this species.          |

### `speciesDetails` fields used

- `image`
- `commonName`
- `otherNames`
- `type`
- `characteristics`
- `similarSpecies`

### `userPlants` structure

Each item in `userPlants` should have:

- `id`: string
- `imageUrl`: string | null
- `name`: string
- `speciesName`: string

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
- User plants section:
  - Only shown if `userPlants.length > 0`.
  - Renders a heading "Your Plants".
  - Each plant shows an image (or placeholder), the plant's name, and a link to the plant's detail page.

## Example Usage

```jsx
<SpeciesDetailsSidebar
  speciesDetails={speciesDetails}
  userPlants={userPlants}
/>
```
