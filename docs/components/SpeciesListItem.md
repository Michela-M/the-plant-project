# `SpeciesListItem`

## Purpose

**SpeciesListItem** renders a plant species preview for use in lists. It displays essential metadata and supports dynamic tags for categorization or filtering.

## Props

| Prop          | Type       | Required | Description                                                                                |
| ------------- | ---------- | -------- | ------------------------------------------------------------------------------------------ |
| `family`      | `string`   | yes      | Botanical family name. Falls back to "Unknown family" if empty.                            |
| `commonName`  | `string`   | yes      | Common plant name. Falls back to "Unknown" if empty.                                       |
| `description` | `string`   | yes      | Short text describing the species. Only displays 2 line, no matter the length of the text. |
| `tags`        | `string[]` | yes      | Array of tag labels passed to the Tag component.                                           |
| `imageUrl`    | `string`   | yes      | URL of the plant image. Falls back to a placeholder if empty.                              |

## Example Usage

```jsx
<SpeciesListItem
  family="Asparagaceae"
  commonName="Snake Plant"
  description="A hardy, upright succulent known for its resilience."
  tags={['low-maintenance', 'air-purifying', 'drought-tolerant']}
  imageUrl="https://example.com/snake.jpg"
/>
```
