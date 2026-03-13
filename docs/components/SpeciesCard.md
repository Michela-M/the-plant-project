# `SpeciesCard`

## Purpose

The **SpeciesCard** component displays a plant’s core identifying information: image, family, and common name. It is a presentational component with no internal state.

## Props

| Prop         | Type     | Required | Description                                                     |
| ------------ | -------- | -------- | --------------------------------------------------------------- |
| `imageUrl`   | `string` | no       | URL of the plant image. Falls back to a placeholder if missing. |
| `family`     | `string` | no       | Displays “Unknown Family” if missing.                           |
| `commonName` | `string` | no       | Displays “Unknown” if missing.                                  |
| `id`         | `string` | yes      | Used to build the species details link at `/species/:id`.       |

## Accessibility Notes

- In the current implementation, image alt text is generated internally and is not configurable through props.
- Current alt behavior:
  - Real image: `{commonName} image`.
  - Placeholder image: `No photo available`.

## Example Usage

```jsx
<SpeciesCard
  imageUrl="https://example.com/monstera.jpg"
  family="Araceae"
  commonName="Monstera Deliciosa"
  id="monstera-deliciosa"
/>
```
