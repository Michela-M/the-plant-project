# `SpeciesListItem` Component

## Purpose

The **SpeciesListItem** component renders a horizontal list-row view of a species, including image, identity fields, optional description, and tags. It is used for list-based browsing and links to species details.

## Props

| Prop          | Type       | Required | Description                                                         |
| ------------- | ---------- | -------- | ------------------------------------------------------------------- |
| `id`          | `string`   | yes      | Used to build the details route `/species/{id}`.                    |
| `family`      | `string`   | yes      | Family name. Displays `Unknown Family` if empty string is passed.   |
| `commonName`  | `string`   | yes      | Common name. Displays `Unknown` if empty string is passed.          |
| `description` | `string`   | no       | Optional description rendered with line clamp styling.              |
| `tags`        | `string[]` | yes      | Rendered as a list of `Tag` components.                             |
| `imageUrl`    | `string`   | yes      | Image URL. Falls back to placeholder when empty string is provided. |

## Behavior Notes

- Entire row is wrapped in a `Link` to `/species/{id}`.
- Image fallback URL is used when `imageUrl` is empty.
- Image alt text is generated internally and is not configurable through props.
- Current alt behavior:
  - Real image: `{commonName} image`.
  - Placeholder image: `No photo available`.
- Description is rendered only when `description` is provided.
- Tags are rendered in order using `tags.map(...)`.
- Includes a ghost plus `IconButton` for quick add affordance.
- Icon container is hidden by default and shown on hover via `group-hover:opacity-100`.

## Example Usage

```jsx
<SpeciesListItem
  id="species-1"
  family="Asparagaceae"
  commonName="Snake Plant"
  description="A very resilient plant."
  tags={['low-maintenance', 'air-purifying']}
  imageUrl="https://example.com/snake.jpg"
/>
```
